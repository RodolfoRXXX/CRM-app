import { Component, Inject, OnInit} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { environment } from 'src/enviroments/enviroment';
import { OptionProduct } from 'src/app/shared/interfaces/optionProduct.interface';


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
  options1!: OptionProduct[];
  options2!: OptionProduct[];
  data_product: any;
  baseURL = environment.SERVER;
  load: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<DialogProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService
  ) {
    this.data_product = {id_enterprise: this.data.id_enterprise, name: this.data.name, id_option_1: this.data.id_option_1, id_option_2: this.data.id_option_2};
  }

  ngOnInit(): void {
    this.searchProduct(this.data_product.id_enterprise, this.data_product.name, this.data_product.id_option_1, this.data_product.id_option_2);
  }

  searchProduct(id_enterprise: number, name: string, id_option_1: number, id_option_2: number): void {
    this.load = true;

    //Obtener la información del producto
    this._api.postTypeRequest('profile/get-product-detail', { id_enterprise: id_enterprise, name: name, id_option_1: id_option_1, id_option_2: id_option_2 }).subscribe( (value: any) => {
      this.product = value.data[0];
      this.load = false;
    })

    //Obtener el conjunto de los valores de option_1 para ese producto seleccionado
    this._api.postTypeRequest('profile/get-product-detail-option1', { name : name, id_enterprise: id_enterprise}).subscribe( (value: any) => {
      console.log(value.data)
      this.options1 = value.data;
    })

    //Obtener el conjunto de los valores de option_2 para ese producto seleccionado
    this._api.postTypeRequest('profile/get-product-detail-option2', { name : name, id_enterprise: id_enterprise}).subscribe( (value: any) => {
      console.log(value.data)
      this.options2 = value.data;
    })
  }

  rechargeProduct(id_enterprise: number, name: string, id_option_1: number, id_option_2: number) {
    this.data_product = {id_enterprise: id_enterprise, name: name, id_option_1: id_option_1, id_option_2: id_option_2};
    this.ngOnInit();
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
