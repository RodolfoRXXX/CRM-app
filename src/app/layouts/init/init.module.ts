import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitRoutingModule } from './init-routing.module';
import { InitComponent } from './init.component';
import { UpdateDirective } from 'src/app/shared/directives/update/update.directive';
import { MaterialModule } from 'src/app/material/material/material.module';
import { HeaderLoginComponent } from './header/header-login/header-login.component';
import { HeaderRechargeComponent } from './header/header-recharge/header-recharge.component';


@NgModule({
  declarations: [
    InitComponent,
    UpdateDirective,
    HeaderLoginComponent,
    HeaderRechargeComponent
  ],
  imports: [
    CommonModule,
    InitRoutingModule,
    MaterialModule
  ]
})
export class InitModule { }
