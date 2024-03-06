import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { MaterialModule } from 'src/app/material/material/material.module';
import { BillingComponent } from '../../../settings/components/billing/billing.component';
import { UserDataComponent } from '../../../settings/components/user-data/user-data.component';
import { SidebarComponent } from 'src/app/shared/standalone/sidebar/sidebar.component';
import { IndexComponent } from '../../../settings/components/index/index.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from 'src/app/services/interceptor.service';
import { EnterpriseDataComponent } from '../../../settings/components/enterprise-data/enterprise-data.component';
import { SecurityComponent } from 'src/app/layouts/settings/components/security/security.component';
import { RolesComponent } from 'src/app/layouts/settings/components/roles/roles.component';


@NgModule({
    declarations: [
        SettingsComponent,
        BillingComponent,
        UserDataComponent,
        IndexComponent,
        EnterpriseDataComponent,
        SecurityComponent,
        RolesComponent
    ],
    imports: [
      CommonModule,
      SettingsRoutingModule,
      MaterialModule,
      SidebarComponent,
      ReactiveFormsModule
  ],
    exports: [
      
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorService,
            multi: true
        }
    ]
})
export class SettingsModule { }
