import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitComponent } from './init.component';

const routes: Routes = [
  { path: '', component: InitComponent,
      children: [
        { 
          path: 'dashboard', 
          loadChildren: () => import('../../work-modules/dashboard/dashboard.module').then(m => m.DashboardModule) 
        },
        { 
          path: 'ticket', 
          loadChildren: () => import('../../work-modules/ticket/ticket.module').then(m => m.TicketModule) 
        },
        { 
          path: 'employee', 
          loadChildren: () => import('../../work-modules/employee/employee.module').then(m => m.EmployeeModule) 
        },

        { path: 'management', loadChildren: () => import('../../work-modules/management/management.module').then(m => m.ManagementModule) },
        { path: 'operation', loadChildren: () => import('../../work-modules/operation/operation.module').then(m => m.OperationModule) },
        { path: 'depo', loadChildren: () => import('../../work-modules/depo/depo.module').then(m => m.DepoModule) },
        { path: 'administration', loadChildren: () => import('../../work-modules/administration/administration.module').then(m => m.AdministrationModule) },
        { path: 'chat', loadChildren: () => import('../../work-modules/chat/chat.module').then(m => m.ChatModule) }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitRoutingModule {}
