import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Product } from 'src/app/shared/interfaces/product.interface';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrl: './product-filters.component.scss'
})
export class ProductFiltersComponent {

  @Input() product!: Product;
  @Output() changeDetected = new EventEmitter<boolean>();

  dataForm!: FormGroup;
  loading: boolean = false;
  filters!: any[];
  chips: string[] = [];

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
      this.getFilters(this.product.id_enterprise);
    }
  }

  createDataForm(): void {
    this.dataForm = this.fb.group({
      id: ['', Validators.required],
      filters: ['']
    });
  }

  setDataForm(product: Product): void {
    this.dataForm.setValue({
      id: product.id || '',
      filters: (product.filters != '')?product.filters.split(',').map(Number):[''],
    });
  }

  //Filtros
  getFilters(id_enterprise: number): void {
    this._api.postTypeRequest('profile/get-filters-obj', { id_enterprise: id_enterprise }).subscribe( (value:any) => {
      if(value.status == 1 && value.data) {
        value.data.forEach((element: any) => {
          element.filter_values = JSON.parse(element.filter_values)
        });
        this.filters = value.data
        this.setChips()
      }
    })
  }

  //setea el array de chips de filtros que se muestran
  setChips(event: any = '') {
    this.chips = [];
    ((event)?event:this.product.filters.split(',').map(Number)).forEach((id: number) => {
      this.filters.forEach(filter => {
          filter.filter_values.forEach((value: any) => {
              if ((value.id === id) && (!this.chips.includes(value.value))) {
                  this.chips.push(value.value);
                }
          });
      });
    });
  }

  resetAll(): void {
    this.setDataForm(this.product);
    this.chips = [];
    this.setChips();
    this.dataForm.markAsPristine();
  }
  
  onSubmit() {
    if(this.dataForm.controls['id'].value > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/edit-product-filters', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess('Los filtros adicionales se han modificado con éxito!');
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
