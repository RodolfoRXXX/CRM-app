import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom, merge, startWith, switchMap, catchError, map, of as observableOf} from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-order-main',
  templateUrl: './order-main.component.html',
  styleUrls: ['./order-main.component.scss']
})
export class OrderMainComponent {

  @Input() order!: any;

  id_enterprise!: number;
  dataForm!: FormGroup;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'product', 'price', 'qty', 'total', 'delete'];
  load: boolean = true;
  loading: boolean = false;
  recharge!: boolean;
  uriImg = environment.SERVER;
  order_status!: any[];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _conector: ConectorsService,
    private _api: ApiService,
    public _auth: AuthService,
    private _notify : NotificationService,
    private _getJson: GetJsonDataService,
  ) {
    this.createDataForm();
  }

  ngOnInit(): void {
    this._conector.setUpdateTitle('Lista de pedidos');
    this._getJson.getData('order_status.json').subscribe( (data: any) => {
      this.order_status = data
    } )
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['order']) {
      console.log(changes['order'].currentValue);
      this.getProducts()
    }
  }

  private getProducts(): void {
    let products: any[] = [];
    if(this.order) {
      const data = JSON.parse(this.order.detail)
      if(data) {
        data.forEach((element: any) => {
          products.push(element.id_product)
        });
      }
    }
    this._api.postTypeRequest('profile/get-products-by-order', { detail: products }).subscribe(
      (value: any) => {
        console.log(value)
        if(value) {
          
        }
      } 
    )
  }

  addProduct() {
    this.dataForm.patchValue({
      id: 1,
      detail: JSON.stringify(
        [
          {
            "id_product": 1,
            "price": 325,
            "qty": 2,
            "discount": 10
          },
          {
            "id_product": 2,
            "price": 235.25,
            "qty": 1,
            "discount": 5
          }
        ]
      )
    })

  }

  ngAfterViewInit(): void {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.recharge = false;
          this.load = true;
          return this._api.postTypeRequest('profile/get-orders', {  })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        this.load = false;
        if (data.data.length) {
          data.data.forEach((element: any) => {
            let data = this.order_status?.find(status => status.id === element.status);
            if(data) {
              element.status = data.status;
              element.bgColor = data.bgColor;
              element.color = data.color;
            }
          });
          this.dataSource.data = data.data;
        } 
      });

    this.dataSource.sort = this.sort;
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

  //Setea los valores del formulario si tuviera que cargarse un conjunto de productos
  setDataForm(product: Product) {
    
  }

  rechargeData() {

  }

  deleteProduct(id_product: number) {
    console.log(id_product)
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
