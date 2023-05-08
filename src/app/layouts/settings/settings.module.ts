import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { MaterialModule } from 'src/app/material/material/material.module';
import { BillingComponent } from './components/billing/billing.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { EditUsernameComponent } from './components/edit-username/edit-username.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';
import { EditEmailComponent } from './components/edit-email/edit-email.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { SidebarComponent } from 'src/app/shared/standalone/sidebar/sidebar.component';
import { IndexComponent } from './components/index/index.component';


@NgModule({
    declarations: [
        SettingsComponent,
        BillingComponent,
        UserDataComponent,
        EditUsernameComponent,
        EditPasswordComponent,
        EditEmailComponent,
        DeleteAccountComponent,
        IndexComponent
    ],
    imports: [
      CommonModule,
      SettingsRoutingModule,
      MaterialModule,
      SidebarComponent
  ],
    exports: [
      
    ],
    providers: [
      
    ]
})
export class SettingsModule { }
