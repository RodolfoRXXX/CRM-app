import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { MaterialModule } from 'src/app/material/material/material.module';
import { AccordionDirective } from 'src/app/shared/directives/accordion.directive';
import { AccordionlinkDirective } from 'src/app/shared/directives/accordionlink.directive';
import { AccordionanchorDirective } from 'src/app/shared/directives/accordionanchor.directive';
import { BillingComponent } from './components/billing/billing.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { EditUsernameComponent } from './components/edit-username/edit-username.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';
import { EditEmailComponent } from './components/edit-email/edit-email.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';


@NgModule({
  declarations: [
    SettingsComponent,
    AccordionDirective,
    AccordionlinkDirective,
    AccordionanchorDirective,
    BillingComponent,
    UserDataComponent,
    EditUsernameComponent,
    EditPasswordComponent,
    EditEmailComponent,
    DeleteAccountComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule
  ],
  exports: [
    AccordionDirective,
    AccordionlinkDirective,
    AccordionanchorDirective
  ],
  providers: [
    AccordionDirective,
    AccordionlinkDirective,
    AccordionanchorDirective
  ]
})
export class SettingsModule { }
