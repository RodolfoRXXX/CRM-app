import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { BillingComponent } from './components/billing/billing.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { EditUsernameComponent } from './components/edit-username/edit-username.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';
import { EditEmailComponent } from './components/edit-email/edit-email.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';

const routes: Routes = [
  { path: '', component: SettingsComponent,
    children: [
      { path: 'user-data', component: UserDataComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'edit-username', component: EditUsernameComponent },
      { path: 'edit-password', component: EditPasswordComponent },
      { path: 'edit-email', component: EditEmailComponent },
      { path: 'delete-account', component: DeleteAccountComponent },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
