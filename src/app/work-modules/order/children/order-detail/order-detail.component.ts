import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Order } from 'src/app/shared/interfaces/order.interface';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  dataForm!: FormGroup;
  order_status!: any[];

  id_order!: number;
  id_enterprise!: number;

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
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Edición de remitos')
    this.route.queryParams.subscribe(params => {
      if(params['id_order']) {
        this.id_order = params['id_order'];
        this.dataForm.patchValue({ id: this.id_order });
        this.getOrder(this.id_order);
      }

      this.getDataLocal()
      .then( id_enterprise => {
        this.id_enterprise = id_enterprise;
        this.dataForm.patchValue({ id_enterprise: id_enterprise })
      })
    });
  }

  //trae el id_enterprise para el formulario
  async getDataLocal(): Promise<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return data.id_enterprise;
  }

  //Formulario creación/edición de producto
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(''),
        id_enterprise: new FormControl(''),
        date: new FormControl(''),
        customer: new FormControl(''),
        detail: new FormControl('', [
          Validators.required
        ]),
        shipment: new FormControl(''),
        observation: new FormControl(''),
        status: new FormControl('')
    });
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
        this.order = value.data[0];
        this.customer = this.order.customer
        this.detail = this.order.detail
        this.shipment = this.order.shipment
        this.observation = this.order.observation
      }
    })
  }

  // Método para encontrar el estado correspondiente
  getStatus(statusId: number) {
    const result = (this.order_status)?this.order_status.find(value => value.id === statusId):'';
    return result
  }

  //funciones que responden a los cambios de los componentes hijos y actualizan el formulario
  setDetail(detail: string) {
    console.log(detail)
    //this.dataForm.patchValue({ detail: detail })
  }
  setCustomer(customer: number) {
    console.log(customer)
    //this.dataForm.patchValue({ customer: customer })
  }
  setShipment(shipment: string) {
    console.log(shipment)
    //this.dataForm.patchValue({ shipment: shipment })
  }
  setObservation(observation: string) {
    console.log(observation)
    //this.dataForm.patchValue({ observation: observation })
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
  }

  onSubmit() {

  }

}
