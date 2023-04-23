import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockedRoutingModule } from './blocked-routing.module';
import { BlockedComponent } from './blocked.component';
import { MaterialModule } from 'src/app/material/material/material.module';


@NgModule({
  declarations: [
    BlockedComponent
  ],
  imports: [
    CommonModule,
    BlockedRoutingModule,
    MaterialModule
  ]
})
export class BlockedModule { }
