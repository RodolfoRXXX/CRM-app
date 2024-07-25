import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { OrderListComponent } from './children/order-list/order-list.component';
import { OrderDetailComponent } from './children/order-detail/order-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material/material/material.module';
import { OrderMainComponent } from './children/order-detail/children/order-main/order-main.component';
import { OrderCustomerDetailComponent } from './children/order-detail/children/order-customer-detail/order-customer-detail.component';
import { OrderShippingAddressComponent } from './children/order-detail/children/order-shipping-address/order-shipping-address.component';
import { OrderObservationComponent } from './children/order-detail/children/order-observations/order-observation.component';


@NgModule({
  declarations: [
    OrderComponent,
    OrderListComponent,
    OrderDetailComponent,
    OrderMainComponent,
    OrderCustomerDetailComponent,
    OrderShippingAddressComponent,
    OrderObservationComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule
  ]
})
export class OrderModule { }
