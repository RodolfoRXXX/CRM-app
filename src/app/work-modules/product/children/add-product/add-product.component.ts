import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  id_product!: number;

  constructor(
    private route: ActivatedRoute,
    private _conector: ConectorsService
  ) { }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Edición de productos')
    this.route.queryParams.subscribe(params => {
      this.id_product = params['id_product'];
      console.log(this.id_product)
    });
  }

  

}
