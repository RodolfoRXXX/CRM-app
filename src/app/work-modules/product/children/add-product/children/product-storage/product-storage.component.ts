import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { Storage } from 'src/app/shared/interfaces/storage.interface';

@Component({
  selector: 'app-product-storage',
  templateUrl: './product-storage.component.html',
  styleUrls: ['./product-storage.component.scss']
})
export class ProductStorageComponent {

  @Input() product!: Product;
  @Output() changeDetected = new EventEmitter<boolean>();

  selectedStorage!: Storage | undefined;

  dataForm!: FormGroup;
  id_enterprise!: number;
  storages: Storage[] = [];
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
      await this.getStorages(employee.id_enterprise);
    } catch (error) {
      console.error('Error executing functions', error);
    }
  }

  getStorages(id_enterprise: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this._api.postTypeRequest('profile/get-storages', { id_enterprise })
        .subscribe({
          next: (response: any) => {
            this.storages = response.data;
            if(this.storages) {
              this.setSelectedStorage(this.product.storage_location)
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

  //Verifica el cambio del select de storage y actualiza la vista de los datos
  changeState(new_provider: number) {
    this.setSelectedStorage(new_provider)
  }

  //Selecciona el proveedor elegido de una lista de proveedores
  setSelectedStorage(id_provider: number): void {
    this.selectedStorage = this.storages.find(item => item.id == id_provider);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && (changes['product'].currentValue.id > 0)) {
      this.setDataForm(changes['product'].currentValue);
    }
  }

  createDataForm(): void {
    this.dataForm = this.fb.group({
      id: ['', Validators.required],
      storage_location: ['', Validators.required]
    });
  }

  setDataForm(product: Product): void {
    this.dataForm.setValue({
      id: product.id || '',
      storage_location: product.storage_location || ''
    });
  }

  //Errores de formulario
    getErrorStorage(): string {
      if (this.dataForm.controls['storage_location'].hasError('required')) return 'Tenés que ingresar una ubicación';
      return '';
    }

  resetAll(): void {
    this.setDataForm(this.product);
    this.setSelectedStorage(this.product.storage_location);
    this.dataForm.markAsPristine();
  }

  onSubmit(): void {
    if(this.dataForm.controls['id'].value > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/edit-product-storage', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess('La ubicación se ha modificado con éxito!');
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
