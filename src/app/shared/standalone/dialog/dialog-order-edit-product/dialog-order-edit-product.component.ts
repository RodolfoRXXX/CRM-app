import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { environment } from 'src/enviroments/enviroment';
import { catchError, map, merge, startWith, switchMap, of as observableOf} from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-dialog-order-edit-product',
  templateUrl: './dialog-order-edit-product.component.html',
  styleUrls: ['./dialog-order-edit-product.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DialogOrderEditProductComponent implements OnInit {

  @ViewChild('input') input!: ElementRef;

  employee!: Employee;
  product!: Product;
  uriImg = environment.SERVER;
  optionBox:boolean = false;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name'];
  load!: boolean;
  qty!: number;
  stkError: boolean = false;
  editRegister: any = [];
  id_product!: number;

  constructor(
    public dialogRef: MatDialogRef<DialogOrderEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    private _conector: ConectorsService,
    public _auth: AuthService
  ) { }

  ngOnInit(): void {
    if(this.data) {
      console.log(this.data.data, this.data.edit)
      this.qty = this.data.data.qty;
      this.editRegister = this.data.edit;
      this.id_product = this.data.data.id_product;
      this.getProduct();
    }
  }

  private getDataLocal(): number {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
    });
    return this.employee.id_enterprise;
  }

  getText(event: Event) {
    const data = (event.target as HTMLInputElement).value;
    if(data.length > 1) {
      this.getOptions(data);
    } else {
      this.optionBox = false;
    }
  }

  //Valor nuevo
    //Carga todas las opciones de producto
    getOptions(text: string) {
      merge()
        .pipe(
          startWith({}),
          map(() => this.getDataLocal()),
          switchMap((id_enterprise) => {
            return this._api.postTypeRequest('profile/get-products-options', { id_enterprise: id_enterprise, text: text })
                          .pipe(catchError(async () => {observableOf(null)}));
          }),
          map((response: any) => {
            if (response && response.data) {
              return response.data;
            } else {
              return []; // Retornamos un array vacío si no hay datos o response.data no existe
            }
          })
        )
        .subscribe((value: any) => {
            // Asignamos los datos únicos al dataSource (suponiendo que dataSource es un MatTableDataSource o similar)
            this.dataSource.data = value
            this.optionBox = true;
          });
    }
    //Función que toma la fila clickeada del table eligiendo esa opción
    onRowClicked(row: any) {
      if(row) {
        this.product = row;
        this.dataSource.data = [];
        this.optionBox = false;
        this.input.nativeElement.value = '';
      }
    }

  //Editar valor // no trae los nombres de las opciones COLOR Y MEDIDA !!!ALERTA!!!
    getProduct() {
      this.load = true;
      this._api.postTypeRequest('profile/get-product-detail-by-id', { id_product: this.data.data.id_product }).subscribe( (value:any) => {
        this.load = false;
        if(value.data) {
          console.log(value.data)
          this.product = value.data[0];
          this.id_product = this.product.id;
        }
      })
    }

  //Edita el valor de cantidad del producto a agregar
  setQty(qty: number) {
    console.log(qty)
    this.qty = qty;
    this.stkError = false;
  }

  confirm(state: boolean): void {
    if(state) {
      //true: agrega
      //amount es la cantidad que quiero restar o sumar del stock del producto
      let amount = this.qty - ((this.data)?this.data.data.qty:0);
      if(amount > this.product.stock_available) {
        //no hay stock suficiente
        this.stkError = true;
      } else {
        //hay stock suficiente
          //completa el array de cambios - La cantidad a retirar del stock es positiva y a agregar es negativa
          if(this.editRegister.length > 0) {
            this.editRegister.find( (element:any) => {
              if(element.id_product == this.id_product) {
                element.editQty = this.qty - this.data.data.qty
              } else {
                this.editRegister.push({ id_product: this.id_product, editQty: (this.data.data)?this.qty - this.data.data.qty:this.qty })
              }
              this.setItem(true);
            })
          } else {
            this.editRegister.push({ id_product: this.id_product, editQty: (this.data.data)?this.qty - this.data.data.qty:this.qty })
            this.setItem(true);
          }
      }
    } else {
      //false: elimina
      this.setItem(false);
    }
  }

  //arma el item de respuesta
  setItem(state: boolean) {
    let item;
    if(state) {
      //agrega
      item = {
        id_product: (this.data)?this.data.data.id_product:this.product.id,
        name: this.product?this.product.name:this.data.data.name,
        description: this.product?this.product.description:this.data.data.description,
        option_1: this.product?this.product.option_1_name:this.data.data.option_1,  //PROBLEMA
        option_2: this.product?this.product.option_2_name:this.data.data.option_2,  //PROBLEMA
        sku: this.product?this.product.sku:this.data.data.sku,
        qty: this.qty,
        discount: 0
      }
    } else {
      //elimina
      item = {
        id_product: this.id_product
      }
    }
    const response = {
      item: item,
      edit: this.editRegister,
      delete: !state
    }
    console.log(response)
    //this.closeDialog(response)
  }

  closeDialog(response: any): void {
    this.dialogRef.close(response);
  }

}

