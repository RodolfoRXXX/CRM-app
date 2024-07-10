import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderDetailComponent } from './children/order-detail/order-detail.component';
import { OrderListComponent } from './children/order-list/order-list.component';

const routes: Routes = [
  { 
    path: '', component: OrderComponent,
      children: [
        { 
          path: '', 
          redirectTo: 'order-list', 
          pathMatch: 'full' 
        },
        {
          path: 'order-list',
          component: OrderListComponent
        },
        {
          path: 'order-detail',
          component: OrderDetailComponent
        },
        { 
          path: '**',
          redirectTo: 'order-list',
          pathMatch: 'full' }
      ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
