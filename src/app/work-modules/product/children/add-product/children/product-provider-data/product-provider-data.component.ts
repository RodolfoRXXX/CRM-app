import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { Provider } from 'src/app/shared/interfaces/provider.interface';

@Component({
  selector: 'app-product-provider-data',
  templateUrl: './product-provider-data.component.html',
  styleUrls: ['./product-provider-data.component.scss']
})
export class ProductProviderDataComponent implements OnInit {

  @Input() product!: Product;
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @Output() changeDetected = new EventEmitter<boolean>();

  selectedProvider!: Provider | undefined;

  dataForm!: FormGroup;
  id_enterprise!: number;
  providers: Provider[] = [];
  filteredProviders!: Observable<Provider[]>;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _conector: ConectorsService,
    private _api: ApiService,
    private _notify: NotificationService
  ) {
    this.createDataForm();
  }

  ngOnInit(): void {
    this.setInitial();
  }

  async getData(): Promise<Employee> {
    return await firstValueFrom(this._conector.getEmployee());
  }

  async setInitial(): Promise<void> {
    try {
      const employee = await this.getData();
      this.id_enterprise = employee.id_enterprise;
      await this.getProviders(employee.id_enterprise);
    } catch (error) {
      console.error('Error executing functions', error);
    }
  }

  getProviders(id_enterprise: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.postTypeRequest('profile/get-providers', { id_enterprise })
        .subscribe({
          next: (response: any) => {
            this.providers = response.data;
            if(this.providers) {
              this.setSelectedProvider(this.product.provider)
            }
            resolve();
          },
          error: (err) => {
            console.error('Error fetching providers', err);
            reject(err);
          }
        });
    });
  }

  //Verifica el cambio del select de proveedor y actualiza la vista de los datos
  changeState(new_provider: number) {
    this.setSelectedProvider(new_provider)
  }

  //Selecciona el proveedor elegido de una lista de proveedores
  setSelectedProvider(id_provider: number): void {
    this.selectedProvider = this.providers.find(item => item.id == id_provider);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && (changes['product'].currentValue.id > 0)) {
      this.setDataForm(changes['product'].currentValue);
    }
  }

  createDataForm(): void {
    this.dataForm = this.fb.group({
      id: ['', Validators.required],
      provider: ['', Validators.required],
      purchase_date: ['', Validators.required],
      purchase_price: [0.00, Validators.required]
    });
  }

  setDataForm(product: Product): void {
    this.dataForm.setValue({
      id: product.id || '',
      provider: product.provider || '',
      purchase_date: product.purchase_date || '',
      purchase_price: product.purchase_price || 0.00
    });
  }

  //Errores de formulario
    getErrorProvider(): string {
      if (this.dataForm.controls['provider'].hasError('required')) return 'Tenés que ingresar un proveedor';
      return '';
    }
    getErrorPurchaseDate(): string {
      if (this.dataForm.controls['purchase_date'].hasError('required')) return 'Elegí una opción';
      return '';
    }
    getErrorPurchasePrice(): string {
      if (this.dataForm.controls['purchase_price'].hasError('required')) return 'Elegí una opción';
      return '';
    }

  resetAll(): void {
    this.setDataForm(this.product);
    this.setSelectedProvider(this.product.provider);
    this.dataForm.markAsPristine();
  }

  onSubmit(): void {
    if(this.dataForm.controls['id'].value > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/edit-product-provider', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess('La información se ha modificado con éxito!');
              this.changeDetected.emit(true);
              this.dataForm.markAsPristine();
            } else{
              //No hubo modificación
              this._notify.showError('No se detectaron cambios. Ingresá información diferente a la actual.')
            }
          } else{
              //Problemas de conexión con la base de datos(res.status == 0)
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        },
        error: (error) => {
          //Error de conexión, no pudo consultar con la base de datos
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      })
    }
  }
}

