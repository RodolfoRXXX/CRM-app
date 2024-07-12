import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { NotificationService } from 'src/app/services/notification.service';
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
  displayedColumns: string[] = ['id', 'product', 'qty', 'edit'];
  load: boolean = true;
  loading: boolean = false;
  recharge!: boolean;
  uriImg = environment.SERVER;
  order_status!: any[];

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
  }

  private getProducts(): void {
    let products: any[] = [];
    let data: any;

    if (this.order) {
      data = JSON.parse(this.order.detail);

      if (data) {
        data.forEach((element: any) => {
          products.push(element.id_product);
        });

        this._api.postTypeRequest('profile/get-products-by-order', { detail: products }).subscribe((value: any) => {
          if (value) {
            this.load = false;
            data.forEach((element: any) => {
              value.data.forEach((product: Product) => {
                if (element.id_product === product.id) {
                  Object.assign(element, {
                    name: product.name,
                    description: product.description,
                    image: product.image
                  });
                }
              });
            });

            this.products = value.data;
            this.dataSource.data = data;
          }
        });
      }
    }
  }

  editProduct(id_product: number = 0) {
    const dialogRef = this._dialog.open(DialogOrderEditProductComponent, { data: { id_product: id_product } });
  }

  //Formulario creación/edición de producto
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(''),
        detail: new FormControl('', [
          Validators.required
        ])
    });
  }


  rechargeData() {

  }

  //Submit del formulario
  onSubmit() {
    

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
    }
  }

}
