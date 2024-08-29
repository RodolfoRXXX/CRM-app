import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Product } from 'src/app/shared/interfaces/product.interface';

@Component({
  selector: 'app-product-stock',
  templateUrl: './product-stock.component.html',
  styleUrls: ['./product-stock.component.scss']
})
export class ProductStockComponent {

  @Input() product!: Product;
  @Output() changeDetected = new EventEmitter<boolean>();

  dataForm!: FormGroup;
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
      stock_real: ['', Validators.required],
      stock_available: [0, Validators.required]
    });
  }

  setDataForm(product: Product): void {
    this.dataForm.setValue({
      id: product.id || '',
      stock_real: product.stock_real || 0,
      stock_available: product.stock_available || 0
    });
  }

  //Errores de formulario
    getErrorStock(): string {
      if (this.dataForm.controls['stock_real'].hasError('required')) return 'Tenés que ingresar un valor';
      return '';
    }

  resetAll(): void {
    this.setDataForm(this.product);
    this.dataForm.markAsPristine();
  }
  
  onSubmit() {
    if(this.dataForm.controls['id'].value > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/edit-product-stock', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess('El stock se ha modificado con éxito!');
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
