import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RechargeRoutingModule } from './recharge-routing.module';
import { RechargeComponent } from './recharge.component';
import { MaterialModule } from 'src/app/material/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RechargeComponent
  ],
  imports: [
    CommonModule,
    RechargeRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class RechargeModule { }
