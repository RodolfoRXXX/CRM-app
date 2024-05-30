import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './children/product-list/product-list.component';
import { AddProductComponent } from './children/add-product/add-product.component';
import { InitResolver } from 'src/app/resolver/init.resolver';

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
