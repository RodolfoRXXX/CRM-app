import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { BillingComponent } from './children/billing/billing.component';
import { IndexComponent } from './children/index/index.component';
import { SecurityComponent } from 'src/app/layouts/init/children/settings/children/security/security.component';
import { RolesComponent } from 'src/app/layouts/init/children/settings/children/roles/roles.component';

const routes: Routes = [
  { path: '', component: SettingsComponent,
    children: [
      { 
        path: '',
        redirectTo: 'index',
        pathMatch: 'full' 
      },
      { 
        path: 'index',
        component: IndexComponent
      },
      { 
        path: 'profile', 
        loadChildren: () => import('./children/profile/profile.module').then(m => m.ProfileModule) 
      },
      { 
        path: 'enterprise-info',
        loadChildren: () => import('./children/enterprise-info/enterprise-info.module').then(m => m.EnterpriseInfoModule)
      },
      { 
        path: 'billing',
        component: BillingComponent 
      },
      { 
        path: 'security',
        component: SecurityComponent 
      },
      { 
        path: 'roles',
        component: RolesComponent 
      },
      { 
        path: '**',
        redirectTo: 'index',
        pathMatch: 'full' 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
