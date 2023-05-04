import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockedRoutingModule } from './blocked-routing.module';
import { BlockedComponent } from './blocked.component';
import { MaterialModule } from 'src/app/material/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BlockedComponent
  ],
  imports: [
    CommonModule,
    BlockedRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class BlockedModule { }
