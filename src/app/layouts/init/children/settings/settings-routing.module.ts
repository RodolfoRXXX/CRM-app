import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { BillingComponent } from '../../../settings/components/billing/billing.component';
import { UserDataComponent } from '../../../settings/components/user-data/user-data.component';
import { IndexComponent } from '../../../settings/components/index/index.component';
import { EnterpriseDataComponent } from '../../../settings/components/enterprise-data/enterprise-data.component';
import { SecurityComponent } from 'src/app/layouts/settings/components/security/security.component';

const routes: Routes = [
  { path: '', component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: IndexComponent },
      { path: 'user-data', component: UserDataComponent },
      { path: 'enterprise-data', component: EnterpriseDataComponent },
      { path: 'billing', component: BillingComponent },
      { path: 'security', component: SecurityComponent },
      { path: '**', redirectTo: 'index', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
