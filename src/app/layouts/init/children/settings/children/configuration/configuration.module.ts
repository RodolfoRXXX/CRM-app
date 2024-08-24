import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationDetailComponent } from './children/configuration-detail/configuration-detail.component';
import { PricingComponent } from './children/pricing/pricing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material/material.module';
import { PlanRemainsComponent } from './children/configuration-detail/children/plan-remains/plan-remains.component';
import { PlanDetailComponent } from './children/configuration-detail/children/plan-detail/plan-detail.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    ConfigurationDetailComponent,
    PricingComponent,
    PlanRemainsComponent,
    PlanDetailComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConfigurationModule { }
