import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterpriseInfoRoutingModule } from './enterprise-info-routing.module';
import { EnterpriseInfoComponent } from './enterprise-info.component';
import { EnterpriseDetailComponent } from './children/enterprise-detail/enterprise-detail.component';
import { EnterpriseEditComponent } from './children/enterprise-edit/enterprise-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material/material.module';


@NgModule({
  declarations: [
    EnterpriseInfoComponent,
    EnterpriseDetailComponent,
    EnterpriseEditComponent
  ],
  imports: [
    CommonModule,
    EnterpriseInfoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EnterpriseInfoModule { }
