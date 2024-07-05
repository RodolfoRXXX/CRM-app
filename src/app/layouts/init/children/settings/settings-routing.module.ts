import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { BillingComponent } from './children/billing/billing.component';
import { IndexComponent } from './children/index/index.component';
import { SecurityComponent } from 'src/app/layouts/init/children/settings/children/security/security.component';
import { RolesComponent } from 'src/app/layouts/init/children/settings/children/roles/roles.component';
import { is_eddle_settings, is_epyr_settings, is_vedc_settings } from 'src/app/guards/settings.guard';
import { is_employee } from 'src/app/guards/auth.guard';

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
        loadChildren: () => import('./children/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [is_employee] 
      },
      { 
        path: 'enterprise-info',
        loadChildren: () => import('./children/enterprise-info/enterprise-info.module').then(m => m.EnterpriseInfoModule),
        canActivate: [is_eddle_settings]
      },
      { 
        path: 'billing',
        component: BillingComponent,
        canActivate: [is_vedc_settings]
      },
      { 
        path: 'security',
        component: SecurityComponent 
      },
      { 
        path: 'roles',
        component: RolesComponent,
        canActivate: [is_epyr_settings]
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
