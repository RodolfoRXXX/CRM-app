import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
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
  @ViewChild('inputQty') inputQty!: ElementRef;

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
  state!: string;
  filters!: any[];

  constructor(
    public dialogRef: MatDialogRef<DialogOrderEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    private _conector: ConectorsService,
    public _auth: AuthService
  ) { }

  ngOnInit(): void {
    if (this.data.id_product > 0) {
      this.qty = this.data.qty_db;
      this.state = 'edit';
      this.getProduct(this.data.id_product);
    } else {
      this.state = 'new';
    }
    this.editRegister = this.data.edit;
  
    // Llamar a getDataLocal al inicio para cargar los datos necesarios
    this.getDataLocal();
  }

  private getDataLocal(): void {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
      this.getFilters(this.employee.id_enterprise);
    });
  }

  getText(event: Event) {
    const data = (event.target as HTMLInputElement).value;
    if(data.length > 1) {
      this.getOptions(data);
    } else {
      this.optionBox = false;
    }
  }

  //Filtros
  getFilters(id_enterprise: number): void {
    this._api.postTypeRequest('profile/get-filters-obj', { id_enterprise: id_enterprise }).subscribe((value: any) => {
      if (value.status == 1 && value.data) {
        value.data.forEach((element: any) => {
          element.filter_values = JSON.parse(element.filter_values);
        });
        this.filters = value.data;
      }
    });
  }

  //Valor nuevo
    //Carga todas las opciones de producto
    getOptions(text: string) {
      this._api.postTypeRequest('profile/get-products-options', { id_enterprise: this.employee.id_enterprise, text: text })
        .pipe(
          catchError(async () => observableOf(null))
        )
        .subscribe((response: any) => {
          if (response && response.data) {
              let arr: any[] = [];
              response.data.forEach((element: any) => {
                if(element.filters.length) {
                  arr = [];
                  (element.filters.split(',').map(Number)).forEach((id: number) => {
                    this.filters.forEach(filter => {
                      filter.filter_values.forEach((value: any) => {
                        if (value.id === id) {
                          arr.push(value.value);
                        }
                      });
                    });
                  });
                  element.filter_values = arr;
                }
              });
            this.dataSource.data = response.data;
            this.optionBox = true;
          } else {
            this.dataSource.data = []; // Retornamos un array vacío si no hay datos o response.data no existe
            this.optionBox = false;
          }
        });
    }
    //Función que toma la fila clickeada del table eligiendo esa opción
    onRowClicked(row: any) {
      if(row) {
        this.product = row;
        this.dataSource.data = [];
        this.optionBox = false;
        this.input.nativeElement.value = '';
        if(this.product.stock_available > 0) {
          setTimeout(() => {
            this.inputQty.nativeElement.focus();
          }, 100);
        }
      }
    }


//Traigo la información del producto
  getProduct(id_product: number) {
    this.load = true;
    this._api.postTypeRequest('profile/get-product-detail', { id_product: id_product }).subscribe( (value:any) => {
      this.load = false;
      if(value.data) {
        value.data[0].filter_values = (value.data[0].filter_values)?value.data[0].filter_values.split(','):[]
        this.product = value.data[0];
      }
    })
  }

  //Edita el valor de cantidad del producto a agregar
  setQty(qty: number) {
    this.qty = qty;
    this.stkError = false;
  }

  confirm(state: string): void {
    //busca si el producto a modificar tiene un registro de cambios
    const findIndex = this.editRegister.findIndex( (element:any) => element.id_product == this.product.id );
    //guarda la cantidad de producto que hay en el remito y almacenado en la db
    let exist = ((this.data.id_product > 0)?this.data.qty_db:0);
    //obtiene la diferencia entre lo que ingresó el usuario y la existencia del producto en el remito
    let amount = this.qty - exist;
    //verifica que la cantidad a editar exista en el stock del producto
    //de acuerdo a para qué se abrió el dialog, es la operatoria que va a realizar el editor de cambios
    if(amount > this.product.stock_available) {
      //no hay stock suficiente
      this.stkError = true;
    } else {
      //habría stock suficiente
      switch (state) {
        case 'new':
          //verifica si hay un producto con cambios pendientes en el registro de cambios, si hay entonces verifica que la suma de la cantidad existente y lo que se va a retirar no supere el stock del producto
          if(findIndex > -1) {
            if((this.editRegister[findIndex].editQty + amount) > this.product.stock_available) {
              //no hay stock suficiente
              this.stkError = true;
            } else {
              this.editRegister[findIndex].editQty += amount
            }
          } else {
            this.editRegister.push({ id_product: this.product.id, editQty: amount })
          }
          break;
        case 'edit':
          //al editar la cantidad de un producto, el valor a guardar en el registro de cambios, no depende de valores previos en este, solo de la cantidad en el remito y la nueva cantidad
          (findIndex > -1)?(this.editRegister[findIndex].editQty = amount):(this.editRegister.push({ id_product: this.product.id, editQty: amount }));
          break;
        case 'delete':
          //elimina la cantidad del producto pero considerando solo la cantidad que viene desde la db del remito de dicho producto
          (findIndex > -1)?this.editRegister[findIndex].editQty -= exist:this.editRegister.push({ id_product: this.product.id, editQty: exist });
          break;
      }
    }
    if(!this.stkError) this.setItem(state);
  }

  //arma el item de respuesta
  setItem(state: string) {
    let item;
    switch (state) {
      case 'new':
        //agrega un nuevo producto al remito
        item = {
          id_product: this.product?this.product.id:this.data.data.id_product,
          name: this.product?this.product.name:this.data.data.name,
          sku: this.product?this.product.sku:this.data.data.sku,
          qty: this.qty,
          status: 2,
          price: this.product?this.product.sale_price:this.data.data.price,
          discount: 0
        }
        break;
      case 'edit':
        //edita la cantidad de un producto ya existente en el remito
        item = {
          id_product: this.product.id,
          qty: this.qty,
        }
        break;
      case 'delete':
        //elimina el producto del remito
        item = {
          id_product: this.product.id
        }
        break;
    }
    const response = {
      item: item,
      edit: this.editRegister,
      state: state
    }
    this.closeDialog(response)
  }

  closeDialog(response: any): void {
    this.dialogRef.close(response);
  }

}
