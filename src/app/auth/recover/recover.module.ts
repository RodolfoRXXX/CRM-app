import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecoverRoutingModule } from './recover-routing.module';
import { RecoverComponent } from './recover.component';
import { MaterialModule } from 'src/app/material/material/material.module';


@NgModule({
  declarations: [
    RecoverComponent
  ],
  imports: [
    CommonModule,
    RecoverRoutingModule,
    MaterialModule
  ]
})
export class RecoverModule { }
