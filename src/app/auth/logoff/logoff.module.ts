import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoffRoutingModule } from './logoff-routing.module';
import { LogoffComponent } from './logoff.component';


@NgModule({
  declarations: [
    LogoffComponent
  ],
  imports: [
    CommonModule,
    LogoffRoutingModule
  ]
})
export class LogoffModule { }
