import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RechargeRoutingModule } from './recharge-routing.module';
import { RechargeComponent } from './recharge.component';
import { MaterialModule } from 'src/app/material/material/material.module';


@NgModule({
  declarations: [
    RechargeComponent
  ],
  imports: [
    CommonModule,
    RechargeRoutingModule,
    MaterialModule
  ]
})
export class RechargeModule { }
