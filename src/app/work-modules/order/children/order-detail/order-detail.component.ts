import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { Order } from 'src/app/shared/interfaces/order.interface';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  employee!: Employee;
  dataForm!: FormGroup;
  order_status!: any[];

  id_order!: number;

  order!: Order;
  customer!: number;
  detail!: any;
  shipment!: string;
  observation!: string;
  editRegister = [];

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _conector: ConectorsService,
    private _api: ApiService,
    private _notify: NotificationService,
    private _getJson: GetJsonDataService,
    private _auth: AuthService
  ) {
    this.createDataForm();
    this._getJson.getData('order_status.json').subscribe( (data: any) => {
      this.order_status = data
    })
    this.getDataLocal().then( (employee: Employee) => this.employee = employee )
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Edición de remitos')
    this.route.queryParams.subscribe(params => {
      if(params['id_order']) {
        this.id_order = parseInt(params['id_order']);
        this.getOrder(this.id_order);
      } else {
        this.setDataForm()
      }
    });
  }

  //trae el id_enterprise para el formulario
  async getDataLocal(): Promise<Employee> {
    try {
      const data = await firstValueFrom(this._conector.getEmployee());
      return data;
    } catch (error) {
      throw error;
    }
  }

  //Formulario creación/edición de producto
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(0),
        id_enterprise: new FormControl(0),
        customer: new FormControl(0),
        detail: new FormControl(''),
        shipment: new FormControl(''),
        observation: new FormControl(''),
        seller: new FormControl('', [
          Validators.required
        ])
    });
  }

  setDataForm(): void {
    this.dataForm.patchValue({
      id: (this.id_order)?this.id_order:0,
      id_enterprise: (this.employee)?this.employee.id_enterprise:0,
      seller: (this.order)?this.order.seller:((this.employee)?this.employee.id:0)
    })
  }

  //Obtiene la fecha actual
  getDateNow(): Date {
    return new Date();
  }

  //trae el remito si existe
  getOrder(id_order: number): void {
    this._api.postTypeRequest('profile/get-order-detail-by-id', { id_order: id_order }).subscribe( (value:any) => {
      if(value.data) {
        //Se encontró el remito y pasa los datos a los componentes hijos para que lo muestren y editen
        this.order = value.data[0]
        this.customer = this.order.customer
        this.detail = this.order.detail
        this.shipment = this.order.shipment
        this.observation = this.order.observation
        this.setDataForm()
      } else {
        this.rechargeComponent()
      }
    })
  }

  // Método para encontrar el estado correspondiente
  getStatus(statusId: number) {
    const result = (this.order_status)?this.order_status.find(value => value.id === statusId):'';
    return result
  }

  //funciones que responden a los cambios de los componentes hijos y actualizan el formulario
  setDetail(detail: any) {
    this.dataForm.patchValue({ detail: JSON.stringify(detail.detail) })
    this.editRegister = detail.edit
  }
  setCustomer(customer: number) {
    this.dataForm.patchValue({ customer: customer })
  }
  setShipment(shipment: string) {
    this.dataForm.patchValue({ shipment: shipment })
  }
  setObservation(observation: string) {
    this.dataForm.patchValue({ observation: observation })
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
  }

  reset() {
    this.dataForm.reset();
    if(this.id_order) {
      this.getOrder(this.id_order)
    } else {
      this.setDataForm()
    }
  }

  onSubmit() {
    console.log(this.dataForm.value, this.editRegister)
    if(this.dataForm.controls['id'].value > 0) {
      //Edita
      this._api.postTypeRequest('profile/update-order-detail', {form: this.dataForm.value, edit: this.editRegister}).subscribe({
        next: (res: any) => {
          console.log(res)
          /*
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.changedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess('La imagen del producto se ha modificado con éxito!');
              this.rechargeComponent();
            } else{
              //No hubo modificación
              this._notify.showError('No se detectaron cambios. Ingresá una imagen diferente a la actual.')
            }
          } else{
              //Problemas de conexión con la base de datos(res.status == 0)
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
              */
        },
        error: (error) => {
          //Error de conexión, no pudo consultar con la base de datos
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      })
    } else {
      //Crea
      if(this.dataForm.controls['customer'].value == 0) {
        //Debe agregarse un customer

      } else {
        //todas las condiciones dadas

      }
    }
  }

}
