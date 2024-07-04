import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterpriseInfoRoutingModule } from './enterprise-info-routing.module';
import { EnterpriseInfoComponent } from './enterprise-info.component';
import { EnterpriseDetailComponent } from './children/enterprise-detail/enterprise-detail.component';
import { EnterpriseEditComponent } from './children/enterprise-edit/enterprise-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material/material.module';
import { EnterpriseEditInfoComponent } from './children/enterprise-edit/children/enterprise-edit-info/enterprise-edit-info.component';
import { EnterpriseEditImageComponent } from './children/enterprise-edit/children/enterprise-edit-image/enterprise-edit-image.component';


@NgModule({
  declarations: [
    EnterpriseInfoComponent,
    EnterpriseDetailComponent,
    EnterpriseEditComponent,
    EnterpriseEditInfoComponent,
    EnterpriseEditImageComponent
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
