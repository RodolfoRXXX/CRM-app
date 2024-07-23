import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Order } from 'src/app/shared/interfaces/order.interface';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { DialogOrderEditProductComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-product/dialog-order-edit-product.component';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-order-main',
  templateUrl: './order-main.component.html',
  styleUrls: ['./order-main.component.scss']
})
export class OrderMainComponent implements OnInit {

  @Input() order!: any;
  @Input() id_customer!: any;

  id_enterprise!: number;
  dataForm!: FormGroup;
  dataSource: any = new MatTableDataSource();
  displayedColumns: string[] = ['sku', 'product', 'qty', 'status', 'edit'];
  load: boolean = false;
  loading: boolean = false;
  recharge!: boolean;
  uriImg = environment.SERVER;
  order_status!: any[];
  edit: boolean = false;
  editRegister = [];

  constructor(
    private _conector: ConectorsService,
    private _api: ApiService,
    public _auth: AuthService,
    private _notify: NotificationService,
    private _getJson: GetJsonDataService,
    private _dialog: MatDialog,
    private _router: Router
  ) {
    this.createDataForm();
    this._getJson.getData('order_status.json').subscribe((data: any) => {
      this.order_status = data;
    });
  }

  private getDataLocal(): void {
    this._conector.getEmployee().subscribe((item: any) => {
      this.id_enterprise = item.id_enterprise;
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['order'] && changes['order'].currentValue !== undefined) {
      this.load = true;
      this.getProducts();
    } else {
      this.getDataLocal();
    }
    if(changes['id_customer'] && changes['id_customer'].currentValue !== undefined) {
      this.dataForm.patchValue({customer: this.id_customer})
    }
    this.setDataForm(this.order)
  }

  //función que extrae los productos de una orden existente
  private getProducts(): void {
    if(this.order) {
      this.dataForm.patchValue({ 
      })
      const data = JSON.parse(this.order.detail);
      if(data) {
        this.load = false;
        this.dataSource.data = data;
      }
    }
  }

  // Método para encontrar el estado correspondiente
  getStatus(statusId: number) {
    return this.order_status.find(value => value.id === statusId);
  }

  //Abro la ventana de diálogo para agregar lineas o modificarlas
  addProduct(id_product: number = 0, qty_db: number = 0) {
    const dialogRef = this._dialog.open(DialogOrderEditProductComponent, { data: {id_product: id_product, qty_db: qty_db, edit: this.editRegister} });
    dialogRef.afterClosed().subscribe(response => {
      if(response) {
        const findItem = this.dataSource.data.findIndex( (element: any) => element.id_product == response.item.id_product );
        if(findItem > -1) {
          //existe el producto en el remito
            //agregar, sumar cantidad o eliminar al producto del remito
            switch (response.state) {
              case 'new':
                this.dataSource.data[findItem].qty += response.item.qty;
                break;
              case 'edit':
                this.dataSource.data[findItem].qty = response.item.qty;
                break;
              case 'delete':
                this.dataSource.data.splice(findItem, 1);
                break;
            }
        } else {
          //no existe
            //agrega un nuevo producto al remito
            this.dataSource.data.push(response.item);
        }
        this.editRegister = response.edit;
        this.ngAfterViewInit();
        this.dataForm.patchValue({
          detail: JSON.stringify(this.dataSource.data)
        })
      }
    });
  }

  //Actualizo el array con los datos
  ngAfterViewInit() {
    this.dataSource.data = this.dataSource.data
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
        stockUpd: new FormControl(''),
        shipment: new FormControl(''),
        observation: new FormControl(''),
        status: new FormControl('')
    });
  }

  //Setear el formulario
  setDataForm(order: Order) {
    if(order) {
      this.dataForm.patchValue({
        id: (order.id)?order.id:0,
        id_enterprise: (order.id_enterprise)?order.id_enterprise:0,
        date: (order.date)?order.date:'',
        customer: (order.customer)?order.customer:0,
        shipment: (order.shipment)?order.shipment:'',
        observation: (order.observation)?order.observation:'',
        status: (order.status)?order.status:''
      })
    }
  }

  //Recargar los datos del remito
  rechargeData() {
    this.getProducts();
    this.editRegister = [];

  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent(id_order: number = 0) {
    if(id_order > 0) {
      this._router.navigate(['init/main/order/order-detail'], { queryParams: { id_order: id_order } });
    }
  }

  //Calcula la fecha actual
  private date(): string {
    const date = new Date();
    date.setDate(date.getDate());
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //Submit del formulario
  onSubmit() {
    if(this.dataForm.controls['customer'].value < 1) {
      this._notify.showWarn('Tenés que agregar un cliente para continuar');
    } else {
      this.loading = true;
      if(this.dataForm.controls['id'].value > 0) {
        //Modifica
        /*
        this._api.postTypeRequest('profile/update-order-detail', this.dataForm.value).subscribe({
          next: (res: any) => {
            this.loading =  false;
            if(res.status == 1){
              //Accedió a la base de datos y no hubo problemas
              if(res.data.changedRows == 1){
                //Modificó datos
                this._notify.showSuccess('Remito actualizado!');
              } else{
                //No hubo modificación
                this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
              }
            } else {
              //Problemas de conexión con la base de datos(res.status == 0)
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
            }
          },
          error: (error: any) => {
            //Error de conexión, no pudo consultar con la base de datos
            this.loading =  false;
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        })*/
      } else {
        this.dataForm.patchValue({id_enterprise: this.id_enterprise, date: this.date(), status: 2});
        //Crea
        /*
        this._api.postTypeRequest('profile/update-order-detail', this.dataForm.value).subscribe({
          next: (res: any) => {
            this.loading =  false;
            if(res.status == 1){
              //Accedió a la base de datos y no hubo problemas
              if(res.data.affectedRows == 1){
                //Modificó datos
                this._notify.showSuccess('Remito creado!');
                this.rechargeComponent(res.data.insertId);
              } else{
                //No hubo modificación
                this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
              }
            } else{
              //Problemas de conexión con la base de datos(res.status == 0)
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
            }
          },
          error: (error: any) => {
            //Error de conexión, no pudo consultar con la base de datos
            this.loading =  false;
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        })*/
      }
      setTimeout(() => {
        this.edit = false;
        this.editRegister = [];
      }, 1500);
    }
  }

}
