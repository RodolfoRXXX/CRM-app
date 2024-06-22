import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { Product } from 'src/app/shared/interfaces/product.interface';

@Component({
  selector: 'app-product-price',
  templateUrl: './product-price.component.html',
  styleUrls: ['./product-price.component.scss']
})
export class ProductPriceComponent implements OnInit {

  @Input() product!: Product;
  @Input() permissions: string[] = [];

  dataForm!: FormGroup;
  employee!: Employee;
  sens_info_admin = '5';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _conector: ConectorsService,
    private _api: ApiService,
    private _notify: NotificationService,
    private _router: Router
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
      this.employee = employee;
    } catch (error) {
      console.error('Error executing functions', error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && (changes['product'].currentValue.id > 0)) {
      this.setDataForm(changes['product'].currentValue);
    }
  }

  createDataForm(): void {
    this.dataForm = this.fb.group({
      id: ['', Validators.required],
      sale_price: ['', Validators.required],
      purchase_price: ['']
    });
  }

  setDataForm(product: Product): void {
    this.dataForm.setValue({
      id: product.id || '',
      sale_price: product.sale_price || 0.00,
      purchase_price: product.purchase_price || 0.00
    });
  }

  setFactor(event: Event) {
    const inputElement = (event.target as HTMLInputElement).value;
    this.dataForm.patchValue({
      sale_price: (this.dataForm.get('purchase_price')?.value)*(parseFloat(inputElement.valueOf()))
    })
    console.log(this.dataForm.value)
  }

  resetAll(): void {
    this.setDataForm(this.product);
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
  }
  
  onSubmit() {
    console.log(this.dataForm.value)
    if(this.dataForm.controls['id'].value > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/edit-product-price', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess('El precio se ha modificado con éxito!');
              this.rechargeComponent();
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
