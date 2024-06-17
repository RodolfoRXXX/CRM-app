import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Product, empty_product } from 'src/app/shared/interfaces/product.interface';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  id_product!: number;
  product: Product = empty_product;

  constructor(
    private route: ActivatedRoute,
    private _conector: ConectorsService,
    private _api: ApiService
  ) { }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Edición de productos')
    this.route.queryParams.subscribe(params => {
      this.id_product = params['id_product'];
      if(this.id_product) this.getProduct(this.id_product)
    });
  }

  getProduct(id_product: number): void {
    this._api.postTypeRequest('profile/get-product-detail-by-id', { id_product: id_product }).subscribe( (value:any) => {
      if(value.data) {
        //Se encontró el producto y lo paso al componente hijo
        this.product = value.data[0];
      }
    })
  }

  

}
