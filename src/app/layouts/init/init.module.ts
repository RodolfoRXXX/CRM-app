import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitRoutingModule } from './init-routing.module';
import { InitComponent } from './init.component';
import { UpdateDirective } from 'src/app/shared/directives/update/update.directive';


@NgModule({
  declarations: [
    InitComponent,
    UpdateDirective
  ],
  imports: [
    CommonModule,
    InitRoutingModule
  ]
})
export class InitModule { }
