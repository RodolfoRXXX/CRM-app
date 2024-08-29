import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Product, empty_product } from 'src/app/shared/interfaces/product.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  id_product!: number;
  dataForm!: FormGroup;
  product: Product = empty_product;
  permissions: string[] = [];
  sens_info_admin = environment.EDIT_PROVIDER_CONTROL;
  activeState: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _conector: ConectorsService,
    private _api: ApiService,
    private _notify: NotificationService
  ) {
    this.createDataForm();
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Edición de productos')
    this.route.queryParams.subscribe(params => {
      this.id_product = params['id_product'];
      if(this.id_product) this.getProduct(this.id_product)
        this.dataForm.patchValue({id: this.id_product})
    });
    this._conector.getEmployee().subscribe( value => {
      //la lista de permisos se almacena como un string y luego se lo separa en un array
      //aunque el string de la DB esté vacío, el split devuelve un array con al menos un valor,
      //que es el valor vacío, por eso la desigualdad es mayor a 1
      this.permissions = value.list_of_permissions.split(',')
    })
  }

  getProduct(id_product: number): void {
    this._api.postTypeRequest('profile/get-product-detail-by-id', { id_product: id_product }).subscribe( (value:any) => {
      if(value.data) {
        //Se encontró el producto y lo paso al componente hijo
        this.product = value.data[0];
        this.activeState = (this.product.state === 'activo')?true:false;
      }
    })
  }

  createDataForm(): void {
    this.dataForm = this.fb.group({
      id: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  // Maneja el cambio detectado por los hijos
  handleChange(event: boolean) {
    if(event) {
      this.getProduct(this.id_product)
    }
  }

  changeState(state: string) {
    this.dataForm.patchValue({state: state})
    if(this.dataForm.controls['id'].value > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/edit-product-activation', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess(`El producto está ${state}!`);
              this.getProduct(this.id_product);
            } else{
              //No hubo modificación
              this._notify.showError('No se detectaron cambios. Volvé a realizar la operación.')
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
