import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './children/product-list/product-list.component';
import { AddProductComponent } from './children/add-product/add-product.component';
import { CategoryComponent } from './children/category/category.component';
import { AddCategoryComponent } from './children/add-category/add-category.component';

const routes: Routes = [
  { 
    path: '', component: ProductComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'product-list', 
        pathMatch: 'full' 
      },
      {
        path: 'product-list',
        component: ProductListComponent
      },
      {
        path: 'add-product',
        component: AddProductComponent
      },
      {
        path: 'category',
        component: CategoryComponent
      },
      {
        path: 'add-category',
        component: AddCategoryComponent
      },
      { 
        path: '**',
        redirectTo: 'product-list',
        pathMatch: 'full' }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
