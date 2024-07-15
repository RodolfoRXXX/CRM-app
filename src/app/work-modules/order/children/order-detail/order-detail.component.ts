import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  id_order!: number;
  dataForm!: FormGroup;
  order!: any;
  activeState: boolean = false;
  order_status!: any[];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _conector: ConectorsService,
    private _api: ApiService,
    private _notify: NotificationService,
    private _getJson: GetJsonDataService
  ) {
    this.createDataForm();
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Edición de remitos')
    this._getJson.getData('order_status.json').subscribe( (data: any) => {
      this.order_status = data
    } )
    this.route.queryParams.subscribe(params => {
      this.id_order = params['id_order'];
      if(this.id_order) {
        this.getOrder(this.id_order)
      }
        this.dataForm.patchValue({id: this.id_order})
    });
  }

  //Obtiene la fecha actual
  getDateNow(): Date {
    return new Date();
  }

  getOrder(id_order: number): void {
    this._api.postTypeRequest('profile/get-order-detail-by-id', { id_order: id_order }).subscribe( (value:any) => {
      if(value.data) {
        value.data.forEach((element: any) => {
          let data = this.order_status?.find(status => status.id === element.status);
          if(data) {
            element.status = data.status;
            element.bgColor = data.bgColor;
            element.color = data.color;
          }
        });
        //Se encontró el remito y lo paso al componente hijo
        this.order = value.data[0];
        //this.activeState = (this.product.state === 'activo')?true:false;
      }
    })
  }

  createDataForm(): void {
    this.dataForm = this.fb.group({
      id: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
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
              this.rechargeComponent();
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
