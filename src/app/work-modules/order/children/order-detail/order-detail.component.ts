import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { Order } from 'src/app/shared/interfaces/order.interface';
import { DialogOrderEditStateComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-state/dialog-order-edit-state.component';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  employee!: Employee;
  dataForm!: FormGroup;

  id_order!: number;

  order!: Order;
  customer!: number;
  detail!: any;
  shipment!: string;
  observation!: string;
  info = {status: 1, seller: 0};
  editRegister = [];

  hasChange: boolean = false;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _conector: ConectorsService,
    private _api: ApiService,
    private _notify: NotificationService,
    private _router: Router,
    private _dialog: MatDialog
  ) {
    this.createDataForm();
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Edición de remitos')
    this.route.queryParams.subscribe(params => {
      if(params['id_order']) {
        this.id_order = parseInt(params['id_order']);
        this.getOrder(this.id_order);
      } else {
        this.getDataLocal().then( (employee: Employee) => {
          this.employee = employee;
          this.setDataForm()
        })
      }
    });

    // Detectar cambios en el formulario
    this.dataForm.valueChanges.subscribe(value => {
      if(this.dataForm.controls['customer'].value != 0 ||
         this.dataForm.controls['detail'].value != '' ||
         this.dataForm.controls['observation'].value != '' ||
         this.dataForm.controls['shipment'].value != ''
      ) {
        this.hasChange = true;
      } else {
        this.hasChange = false;
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

  //cambia el estado del remito - edita el estado de sus productos
  changeState(detail: string, id_order: number) {
    const dialogRef = this._dialog.open(DialogOrderEditStateComponent, { data: { detail: detail, id_order: id_order }});
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          console.log(result)
        }
      });
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
        this.info.status = this.order.status
        this.info.seller = this.order.seller
        this.setDataForm()
      } else {
        this.rechargeComponent()
      }
    })
  }

  //funciones que responden a los cambios de los componentes hijos y actualizan el formulario
  setDetail(detail: any) {
    this.dataForm.patchValue({ detail: JSON.stringify(detail.detail) })
    this.detail = JSON.stringify(detail.detail)
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
  rechargeComponent(id_order: number = 0) {
    if(id_order > 0) {
      this._router.navigate(['init/main/order/order-detail'], { queryParams: { id_order: id_order } });
    } else {
      window.location.reload();
    }
  }

  resetAll() {
    this.editRegister = [];
    this.dataForm.reset();
    this.setDataForm();
  }

  onSubmit() {
    if(this.dataForm.controls['id'].value > 0) {
      //Edita
      this.loading =  true;
      this._api.postTypeRequest('profile/update-order-detail', {form: this.dataForm.value, edit: this.editRegister}).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.affectedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess('Se modificó el remito!');
              this.resetAll();
              //this.rechargeComponent();
            } else{
              //No hubo modificación
              this._notify.showError('No se detectaron cambios.')
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
    } else {
      //Crea
      if(this.dataForm.controls['customer'].value == 0) {
        //Debe agregarse un customer
        this._notify.showWarn('Agregá un cliente para este un remito');
      } else {
        //todas las condiciones dadas
        this.loading =  true;
        this._api.postTypeRequest('profile/create-order-detail', {form: this.dataForm.value, edit: this.editRegister}).subscribe({
          next: (res: any) => {
            this.loading =  false;
            if(res.status == 1){
              //Accedió a la base de datos y no hubo problemas
              if(res.data.affectedRows == 1){
                //Modificó la imagen
                this._notify.showSuccess('Se ha creado un nuevo remito!');
                this.rechargeComponent(res.data.insertId);
              } else{
                //No hubo modificación
                this._notify.showError('No se detectaron cambios.')
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

}
