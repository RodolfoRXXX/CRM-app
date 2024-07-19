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

@Component({
  standalone: true,
  selector: 'app-dialog-order-edit-product',
  templateUrl: './dialog-order-edit-product.component.html',
  styleUrls: ['./dialog-order-edit-product.component.scss'],
  imports: [
    MaterialModule,
    CommonModule
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

  constructor(
    public dialogRef: MatDialogRef<DialogOrderEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    private _conector: ConectorsService,
    public _auth: AuthService
  ) { }

  ngOnInit(): void {
    if(this.data) {
      console.log(this.data)
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

  //Editar valor
    getProduct() {
      this.load = true;
      this._api.postTypeRequest('profile/get-product-detail-by-id', { id_product: this.data.id_product }).subscribe( (value:any) => {
        this.load = false;
        if(value.data) {
          console.log(value.data)
          console.log(this.data)
          this.product = value.data[0]
        }
      })
    }

  confirm(product: Product): void {
    if(product) {
      const item = {
        id_product: product.id,
        name: product.name,
        description: product.description,
        option_1: product.option_1_name,
        option_2: product.option_2_name,
        sku: product.sku,
        qty: 1,
        discount: 0
      }
      this.closeDialog(item);
    } else {
      this.closeDialog(false);
    }
  }

  closeDialog(response: any): void {
    this.dialogRef.close(response);
  }

}

