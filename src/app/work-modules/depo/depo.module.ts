import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepoRoutingModule } from './depo-routing.module';
import { DepoComponent } from './depo.component';


@NgModule({
  declarations: [
    DepoComponent
  ],
  imports: [
    CommonModule,
    DepoRoutingModule
  ]
})
export class DepoModule { }
