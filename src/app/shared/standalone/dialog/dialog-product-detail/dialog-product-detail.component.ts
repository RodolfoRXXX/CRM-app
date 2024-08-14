import { Component, Inject, OnInit} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { environment } from 'src/enviroments/enviroment';


@Component({
  standalone: true,
  selector: 'app-dialog-product-detail',
  templateUrl: './dialog-product-detail.component.html',
  styleUrls: ['./dialog-product-detail.component.scss'],
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class DialogProductDetailComponent implements OnInit {

  product!: Product;
  baseURL = environment.SERVER;
  load: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    this.searchProduct(this.data.id_product);
  }

  searchProduct(id_product: number): void {
    this.load = true;
    //Obtener la información del producto
    this._api.postTypeRequest('profile/get-product-detail', { id_product: id_product }).subscribe( (value: any) => {
      if (value.data) {
        //Si existe el producto lo carga
        this.product = value.data[0];
      } else {
        //Si NO existe el producto centonces cierra el dialog como error
        this.closeDialog();
      }
      this.load = false;
    })
  }

  getStatusCategory(color: string): any {
    const data = JSON.parse(color);
    return {
      'color': data.color,
      'background-color': data.bgColor
    };
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
