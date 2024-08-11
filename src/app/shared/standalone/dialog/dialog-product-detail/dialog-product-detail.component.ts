import { Component, Inject, OnInit} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { environment, permissions } from 'src/enviroments/enviroment';
import { Router } from '@angular/router';
import { ConectorsService } from 'src/app/services/conectors.service';
import { AuthService } from 'src/app/services/auth.service';


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
  variants: any[] = [];
  data_product: any;
  baseURL = environment.SERVER;
  load: boolean = true;
  permissions: string[] = [];
  sens_info_admin = permissions.EDIT_PROVIDER_CONTROL;
  add_product_admin = permissions.EDIT_PRODUCT_CONTROL;

  constructor(
    public dialogRef: MatDialogRef<DialogProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    public _auth: AuthService,
    private _router: Router,
    private _conector: ConectorsService
  ) {
    this.data_product = {id_enterprise: this.data.id_enterprise, name: this.data.name, id_option_1: this.data.id_option_1, id_option_2: this.data.id_option_2};
  }

  ngOnInit(): void {
    this._conector.getEmployee().subscribe( value => {
      //la lista de permisos se almacena como un string y luego se lo separa en un array
      //aunque el string de la DB esté vacío, el split devuelve un array con al menos un valor,
      //que es el valor vacío, por eso la desigualdad es mayor a 1
      this.permissions = value.list_of_permissions.split(',')
    })
    this._auth.getOptionName1()
    this.searchProduct(this.data_product.id_enterprise, this.data_product.name, this.data_product.id_option_1, this.data_product.id_option_2);
  }

  searchProduct(id_enterprise: number, name: string, id_option_1: number, id_option_2: number): void {
    this.load = true;

    //Obtener la información del producto
    this._api.postTypeRequest('profile/get-product-detail', { id_enterprise: id_enterprise, name: name, id_option_1: id_option_1, id_option_2: id_option_2 }).subscribe( (value: any) => {
      if (value.data) {
        //Si existe el producto lo carga
        this.product = value.data[0];
      } else {
        //Si NO existe el producto centonces cierra el dialog como error
        this.closeDialog();
      }
      this.load = false;
    })

    //Obtener las variantes del producto
    this._api.postTypeRequest('profile/get-product-variants', { id_enterprise: id_enterprise, name: name }).subscribe( (value: any) => {
      if (value.data) {
        //Si existen las variantes las carga
        this.variants = value.data
      }
    })
  }

  //Toma el item de la variante seleccionada desde el select
  changeVariant(event: Product) {
    this.rechargeProduct(event.id_enterprise, event.name, event.id_option_1, event.id_option_2)
  }

  rechargeProduct(id_enterprise: number, name: string, id_option_1: number, id_option_2: number) {
    this.data_product = {id_enterprise: id_enterprise, name: name, id_option_1: id_option_1, id_option_2: id_option_2};
    this.ngOnInit();
  }

  editProduct(id_product: number) {
    this.closeDialog()
    this._router.navigate(['init/main/product/add-product'], { queryParams: { id_product: id_product } });
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

}
