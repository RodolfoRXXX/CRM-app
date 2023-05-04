import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgetRoutingModule } from './forget-routing.module';
import { ForgetComponent } from './forget.component';
import { MaterialModule } from 'src/app/material/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ForgetComponent
  ],
  imports: [
    CommonModule,
    ForgetRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ForgetModule { }
