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
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
  preview!: any;
  customer!: number;
  detail!: any;
  shipment!: string;
  observation!: string;
  info = {status: 1, seller: 0};
  editRegister = [];

  hasChange: boolean = false;
  loading: boolean = false;
  loadPDF: boolean = false;

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
  changeState(detail: string, id_order: number, status: any) {
    this._dialog.open(DialogOrderEditStateComponent, { data: { detail: detail, id_order: id_order, status: status }});
  }

  //función que genera la vista del remito en pdf
  getView() {
    this.loadPDF = true;
      const documentDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60], // Márgenes de la página
        content: [
          {
            columns: [
              {
                width: '50%',
                stack: [
                  { text: this.preview ? this.preview.e_name : 'Sin información', style: 'companyName' },
                  { text: this.preview ? this.preview.e_address : 'Sin información' },
                  { text: (this.preview?.e_city ? this.preview.e_city + ', ' : '') + (this.preview?.e_state || '') },
                  { text: (this.preview?.e_cp ? this.preview.e_cp + ', ' : '') + (this.preview?.e_country || '') },
                  { text: 'Tel: ' + (this.preview ? this.preview.e_phone : 'Sin información') }
                ]
              },
              {
                width: '50%',
                stack: [
                  { text: 'Remito', style: 'header', alignment: 'right' },
                  { text: 'R' + (this.preview?.nroRemito || ''), alignment: 'right' },
                  { text: 'Fecha: ' + (this.preview?.date ? new Date(this.preview.date).toLocaleDateString('es-AR') : ''), alignment: 'right' },
                  { text: 'CUIT: ' + (this.preview?.e_cuit || 'Sin información'), alignment: 'right' }
                ]
              }
            ]
          },
          { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] }, // Separador
      
          { text: 'Cliente', style: 'subheader', margin: [0, 10, 0, 5] },
          {
            columns: [
              {
                width: '50%',
                stack: [
                  { text: this.preview ? this.preview.c_name : 'Sin información', style: 'clientName' },
                  { text: 'Tel: ' + (this.preview?.c_phone || '') },
                  { text: 'CUIT/L: ' + (this.preview?.c_cuit || '') }
                ]
              },
              {
                width: '50%',
                stack: [
                  { text: this.preview ? this.preview.c_address : 'Sin información' },
                  { text: (this.preview?.c_city ? this.preview.c_city + ', ' : '') + (this.preview?.c_state || '') },
                  { text: this.preview?.c_country || '' }
                ]
              }
            ]
          },
          { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] }, // Separador
      
          { text: 'Productos', style: 'subheader', margin: [0, 10, 0, 5] },
          {
            table: {
              widths: ['auto', 'auto', '*'],
              body: (() => {
                const body = [
                  [
                    { text: 'Código', style: 'tableHeader' },
                    { text: 'Cantidad', style: 'tableHeader' },
                    { text: 'Descripción', style: 'tableHeader' }
                  ]
                ];
      
                // Añadir las filas con los productos
                const rows = this.preview?.detail || [];
                rows.forEach((item: any) => {
                  body.push([
                    item.sku,
                    item.qty,
                    item.name
                  ]);
                });
      
                // Rellenar con filas vacías hasta alcanzar 10 filas
                for (let i = rows.length; i < 10; i++) {
                  body.push([{text: '-', style: ''}, {text: '', style: ''}, {text: '', style: ''}]);
                }
      
                return body;
              })()
            },
            layout: {
              fillColor: function (rowIndex: any) {
                return (rowIndex % 2 === 0) ? '#f3f3f3' : null;
              }
            }
          },
          { text: 'Observaciones:', style: 'subheader', margin: [0, 10, 0, 5] },
          { text: this.preview?.observation || 'Sin observaciones' },
          { text: '', margin: [0, 0, 0, 0] }, // Ajusta para ocupar todo el alto
          { text: 'Entrega', style: 'subheader', margin: [0, 130, 0, 5] },
          ...(this.preview?.shipment
            ? [
                { text: `${this.preview.shipment.address}, ${this.preview.shipment.betweenStreets || ''}`, margin: [0, 0, 0, 0] },
                { text: `${this.preview.shipment.cp}, ${this.preview.shipment.city}, ${this.preview.shipment.state}, ${this.preview.shipment.country}`, margin: [0, 5, 0, 0] },
                { text: `Horario: ${this.preview.shipment.schedule}`, margin: [0, 5, 0, 0] }
              ]
            : []),
          { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] }, // Separador
      
          {
            columns: [
              {
                width: '50%',
                text: 'Firma Remitente: ____________________________',
                margin: [0, 20, 0, 5]
              },
              {
                width: '50%',
                text: 'Firma Destinatario: ___________________________',
                alignment: 'right',
                margin: [0, 20, 0, 5]
              }
            ]
          }
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          companyName: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 5]
          },
          clientName: {
            fontSize: 16,
            bold: true,
            margin: [0, 0, 0, 5]
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          }
        }
    };
      const pdf = pdfMake.createPdf(documentDefinition);
      this.loadPDF = false;
      pdf.open();
  
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
    this.dataForm.setValue({
      id: (this.id_order)?this.id_order:0,
      id_enterprise: (this.employee)?this.employee.id_enterprise:0,
      customer: 0,
      detail: '',
      shipment: '',
      observation: '',
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
        this.setDataForm()
        this.order = value.data[0]
        this.customer = this.order.customer
        this.detail = this.order.detail
        this.shipment = this.order.shipment
        this.observation = this.order.observation
        this.info.status = this.order.status
        this.info.seller = this.order.seller
        this.preview = value.data[0]
        this.preview.detail = (this.preview.detail != '')?JSON.parse(this.preview.detail):'';
        this.preview.shipment = (this.preview.shipment != '')?JSON.parse(this.preview.shipment):'';
      } else {
        this._notify.showWarn('Ha ocurrido un problema con este pedido.');
        this._router.navigate(['init/main/order/order-list']);
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
    }
  }

  resetAll() {
    this.editRegister = [];
    if(this.id_order) {
      this.getOrder(this.id_order);
    } else {
      this.setDataForm();
        this.customer = 0
        this.detail = ''
        this.shipment = ''
        this.observation = ''
        this.info.status = 1
        this.info.seller = 0
    }
    this.dataForm.markAsPristine();
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
        this._notify.showInfo('Agregá un cliente para este un remito');
      } else {
        //todas las condiciones dadas
        this.loading =  true;
        this._api.postTypeRequest('profile/create-order-detail', {form: this.dataForm.value, edit: this.editRegister}).subscribe({
          next: (res: any) => {
            this.loading =  false;
            if(res.status == 1){
              //Accedió a la base de datos y no hubo problemas
              if(res.data.orderId){
                //Modificó la imagen
                this._notify.showSuccess('Se ha creado un nuevo remito!');
                setTimeout(() => {
                  this.rechargeComponent(res.data.orderId);
                }, 2000);
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
