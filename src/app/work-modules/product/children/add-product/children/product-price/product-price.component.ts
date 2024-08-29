import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-price',
  templateUrl: './product-price.component.html',
  styleUrls: ['./product-price.component.scss']
})
export class ProductPriceComponent {

  @Input() product!: Product;
  @Input() permissions: string[] = [];
  @Output() changeDetected = new EventEmitter<boolean>();

  dataForm!: FormGroup;
  sens_info_admin = environment.EDIT_PROVIDER_CONTROL;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _api: ApiService,
    private _notify: NotificationService
  ) {
    this.createDataForm();
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
  }

  resetAll(): void {
    this.setDataForm(this.product);
  }
  
  onSubmit() {
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
              this.changeDetected.emit(true);
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
