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


@NgModule({
  declarations: [
    OrderComponent,
    OrderListComponent,
    OrderDetailComponent
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
