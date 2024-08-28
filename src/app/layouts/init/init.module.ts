import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitRoutingModule } from './init-routing.module';
import { InitComponent } from './init.component';
import { MaterialModule } from 'src/app/material/material/material.module';
import { HeaderLoginComponent } from './header/header-login/header-login.component';
import { HeaderRechargeComponent } from './header/header-recharge/header-recharge.component';


@NgModule({
  declarations: [
    InitComponent,
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
