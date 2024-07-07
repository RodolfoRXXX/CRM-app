import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnterpriseInfoComponent } from './enterprise-info.component';
import { EnterpriseDetailComponent } from './children/enterprise-detail/enterprise-detail.component';
import { EnterpriseEditComponent } from './children/enterprise-edit/enterprise-edit.component';
import { EnterpriseInfoResolver } from 'src/app/resolver/enterprise-info.resolver';
import { RolesComponent } from './children/roles/roles.component';
import { EnterpriseConfigurationComponent } from './children/enterprise-configuration/enterprise-configuration.component';

const routes: Routes = [
  { path: '', component: EnterpriseInfoComponent, 
    children: [
      { 
        path: '', 
        redirectTo: 'enterprise-detail', 
        pathMatch: 'full' 
      },
      {
        path: 'enterprise-detail',
        component: EnterpriseDetailComponent,
        resolve: { enterprise: EnterpriseInfoResolver }
      },
      {
        path: 'enterprise-edit',
        component: EnterpriseEditComponent,
        resolve: { enterprise: EnterpriseInfoResolver }
      },
      {
        path: 'roles',
        component: RolesComponent
      },
      {
        path: 'configuration',
        component: EnterpriseConfigurationComponent,
        resolve: { enterprise: EnterpriseInfoResolver }
      },
      { 
        path: '**',
        redirectTo: 'enterprise-detail',
        pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterpriseInfoRoutingModule { }
