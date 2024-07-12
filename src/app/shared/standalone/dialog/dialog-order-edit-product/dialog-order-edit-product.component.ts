import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { environment } from 'src/enviroments/enviroment';
import { catchError, map, merge, startWith, switchMap, of as observableOf} from 'rxjs';
import { Product } from 'src/app/shared/interfaces/product.interface';

@Component({
  standalone: true,
  selector: 'app-dialog-storage-detail',
  templateUrl: './dialog-order-edit-product.component.html',
  styleUrls: ['./dialog-order-edit-product.component.scss'],
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class DialogOrderEditProductComponent implements OnInit {

  product!: Product;
  load = true;
  recharge = false;
  uriImg = environment.SERVER;
  baseImg = this.uriImg + 'no-image.png';
  inputBoxName:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOrderEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    if(this.data) {
      this.loadProductData(this.data.id_product);
    }
  }

  loadProductData(id_product: number): void {
    this.getProduct(id_product);
  }

  getProduct(id_product: number, name: string = '', id_enterprise: number = 0): void {
    this._api.postTypeRequest('profile/get-product-id-name', { id_product: id_product, name: name, id_enterprise: id_enterprise }).subscribe(
      (value: any) => {
        if (value.data && value.data.length > 0) {
          console.log(value.data)
          this.product = value.data[0];
          this.load = false;
        } else {
          this.recharge = true;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  //Valor nuevo
  //Carga todas las opciones de producto
  searchAll() {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this._api.postTypeRequest('profile/get-products-listOfName', { id_enterprise: 1})
                        .pipe(catchError(async () => {observableOf(null)}));
        }),
        map((response: any) => {
          if (response && response.data) {
            
            return '';
          } else {
            return []; // Retornamos un array vacío si no hay datos o response.data no existe
          }
        })
      )
      .subscribe((value: any) => {
          // Asignamos los datos únicos al dataSource (suponiendo que dataSource es un MatTableDataSource o similar)
          
          this.inputBoxName = true;
        });
  }

  rechargeData() {

  }

  confirm(id_product: number): void {
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

}

