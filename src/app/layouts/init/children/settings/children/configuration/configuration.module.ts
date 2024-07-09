import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationDetailComponent } from './children/configuration-detail/configuration-detail.component';
import { PricingComponent } from './children/pricing/pricing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material/material.module';


@NgModule({
  declarations: [
    ConfigurationComponent,
    ConfigurationDetailComponent,
    PricingComponent
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
