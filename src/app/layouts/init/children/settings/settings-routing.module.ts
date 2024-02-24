import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { BillingComponent } from '../../../settings/components/billing/billing.component';
import { UserDataComponent } from '../../../settings/components/user-data/user-data.component';
import { EditUsernameComponent } from '../../../settings/components/edit-username/edit-username.component';
import { EditPasswordComponent } from '../../../settings/components/edit-password/edit-password.component';
import { EditEmailComponent } from '../../../settings/components/edit-email/edit-email.component';
import { IndexComponent } from '../../../settings/components/index/index.component';
import { EnterpriseDataComponent } from '../../../settings/components/enterprise-data/enterprise-data.component';

const routes: Routes = [
  { path: '', component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: IndexComponent },
      { path: 'user-data', component: UserDataComponent },
      { path: 'enterprise-data', component: EnterpriseDataComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'edit-username', component: EditUsernameComponent },
      { path: 'edit-password', component: EditPasswordComponent },
      { path: 'edit-email', component: EditEmailComponent },
      { path: '**', redirectTo: 'index', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
