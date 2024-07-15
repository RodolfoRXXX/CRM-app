import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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

  id_enterprise!: number;
  dataForm!: FormGroup;
  products!: Product[];
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['sku', 'product', 'qty', 'delete'];
  load: boolean = true;
  loading: boolean = false;
  recharge!: boolean;
  uriImg = environment.SERVER;
  order_status!: any[];
  edit: boolean = false;

  constructor(
    private _conector: ConectorsService,
    private _api: ApiService,
    public _auth: AuthService,
    private _notify: NotificationService,
    private _getJson: GetJsonDataService,
    private _dialog: MatDialog
  ) {
    this.createDataForm();
  }

  ngOnInit(): void {
    this._conector.setUpdateTitle('Lista de pedidos');
    this._getJson.getData('order_status.json').subscribe((data: any) => {
      this.order_status = data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order']) {
      this.getProducts();
    }
    this.setDataForm(this.order)
  }

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

  //Actualizan el this.order.detail
    //Actualizo la cantidad de una fila
    setQty(element: any, newQty: number) {
      element.qty = newQty;
      this.dataForm.patchValue({
        detail: JSON.stringify(this.dataSource.data)
      })
    }
    //Elimino una linea
    deleteProduct(id_product: number) {
      const index = this.dataSource.data.findIndex((element: any) => element.id_product == id_product)
      if(index !== -1) {
        this.dataSource.data.splice(index, 1);
      }
      this.ngAfterViewInit();
      this.dataForm.patchValue({
        detail: JSON.stringify(this.dataSource.data)
      })
    }
    //Abro la ventana de diálogo para agregar lineas
    addProduct() {
      const dialogRef = this._dialog.open(DialogOrderEditProductComponent);
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          //Aquí abre la ventana de diálogo para agregar productos
          const index = this.dataSource.data.findIndex((element: any) => element.id_product == result.id_product);
          if(index !== -1) {
            this.dataSource.data.find( (element: any) => {
              if(element.id_product == result.id_product) {
                element.qty++;
              }
            } )
          } else {
            this.dataSource.data.push(result)
          }
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
  }

  //Submit del formulario
  onSubmit() {
    console.log(this.dataForm.value)
    /*
    if(this.dataForm.controls['id'].value > 0) {
      //Modifica el producto
      this._api.postTypeRequest('profile/update-order-detail', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          console.log(res)
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó datos empresa
              this._notify.showSuccess('Producto actualizado con éxito!');
              
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
      })
    } else {
      //Crea un producto nuevo
      this._api.postTypeRequest('profile/create-product', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.affectedRows == 1){
              //Modificó datos empresa
              this._notify.showSuccess('Nuevo producto creado con éxito!');
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
      })
    }*/
  }

}
