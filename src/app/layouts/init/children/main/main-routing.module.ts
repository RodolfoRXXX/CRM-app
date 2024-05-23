import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { DashboardComponent } from './children/dashboard/dashboard.component';

const routes: Routes = [
  { 
    path: '', component: MainComponent,
      children: [
        { 
          path: '', 
          redirectTo: 'dashboard', 
          pathMatch: 'full' 
        },
        {
          path: 'dashboard',
          component: DashboardComponent
        },
        {
          path: 'operation',
          loadChildren: () => import('../../../../work-modules/operation/operation.module').then(m => m.OperationModule)
        },
        {
          path: 'depo',
          loadChildren: () => import('../../../../work-modules/depo/depo.module').then(m => m.DepoModule)
        },
        { 
          path: '**',
          redirectTo: 'dashboard',
          pathMatch: 'full' }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
