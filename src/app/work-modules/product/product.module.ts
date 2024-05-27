import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './children/product-list/product-list.component';
import { AddProductComponent } from './children/add-product/add-product.component';
import { MaterialModule } from 'src/app/material/material/material.module';


@NgModule({
  declarations: [
    ProductComponent,
    ProductListComponent,
    AddProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    MaterialModule
  ]
})
export class ProductModule { }
