import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoffRoutingModule } from './logoff-routing.module';
import { LogoffComponent } from './logoff.component';
import { MaterialModule } from 'src/app/material/material/material.module';


@NgModule({
  declarations: [
    LogoffComponent
  ],
  imports: [
    CommonModule,
    LogoffRoutingModule,
    MaterialModule
  ]
})
export class LogoffModule { }
