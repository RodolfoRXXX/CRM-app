import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnterpriseInfoComponent } from './enterprise-info.component';
import { EnterpriseDetailComponent } from './children/enterprise-detail/enterprise-detail.component';
import { EnterpriseEditComponent } from './children/enterprise-edit/enterprise-edit.component';

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
        component: EnterpriseDetailComponent
      },
      {
        path: 'enterprise-edit',
        component: EnterpriseEditComponent
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
