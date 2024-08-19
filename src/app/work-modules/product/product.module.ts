import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './children/product-list/product-list.component';
import { AddProductComponent } from './children/add-product/add-product.component';
import { MaterialModule } from 'src/app/material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ProductInformationComponent } from './children/add-product/children/product-information/product-information.component';
import { ProductImageComponent } from './children/add-product/children/product-image/product-image.component';
import { ProductProviderDataComponent } from './children/add-product/children/product-provider-data/product-provider-data.component';
import { ProductStockComponent } from './children/add-product/children/product-stock/product-stock.component';
import { ProductPriceComponent } from './children/add-product/children/product-price/product-price.component';
import { ProductStorageComponent } from './children/add-product/children/product-storage/product-storage.component';
import { CategoryComponent } from './children/category/category.component';
import { AddCategoryComponent } from './children/add-category/add-category.component';
import { ProductFiltersComponent } from './children/add-product/children/product-filters/product-filters.component';


@NgModule({
  declarations: [
    ProductComponent,
    ProductListComponent,
    AddProductComponent,
    ProductInformationComponent,
    ProductImageComponent,
    ProductProviderDataComponent,
    ProductStockComponent,
    ProductPriceComponent,
    ProductStorageComponent,
    CategoryComponent,
    AddCategoryComponent,
    ProductFiltersComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule
  ]
})
export class ProductModule { }
