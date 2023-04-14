import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RechargeRoutingModule } from './recharge-routing.module';
import { RechargeComponent } from './recharge.component';


@NgModule({
  declarations: [
    RechargeComponent
  ],
  imports: [
    CommonModule,
    RechargeRoutingModule
  ]
})
export class RechargeModule { }
