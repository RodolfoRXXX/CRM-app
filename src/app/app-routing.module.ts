import { NgModule } from '@angular/core';
import { FrameComponent } from './layouts/frame/frame.component';
import { isNot_active, isNot_authenticated, isNot_employee, isNot_logged, is_active, is_authenticated, is_employee, is_logged } from './guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { InitResolver } from './resolver/init.resolver';


const routes: Routes = [
  { path: '', component: FrameComponent,
      children: [
        { 
          path: '', 
          redirectTo: 'recharge', 
          pathMatch: 'full' 
        },
        { 
          path: 'login', 
          loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule), 
          canActivate: [isNot_logged, isNot_authenticated] 
        },
        { 
          path: 'register', 
          loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule), 
          canActivate: [isNot_logged, isNot_authenticated] 
        },
        { 
          path: 'recharge', 
          loadChildren: () => import('./auth/recharge/recharge.module').then(m => m.RechargeModule), 
          canActivate: [is_logged, isNot_authenticated] 
        },
        { 
          path: 'forget', 
          loadChildren: () => import('./auth/forget/forget.module').then(m => m.ForgetModule), 
          canActivate: [isNot_logged, isNot_authenticated] 
        },
        { 
          path: 'logoff', 
          loadChildren: () => import('./auth/logoff/logoff.module').then(m => m.LogoffModule), 
          canActivate: [is_logged] 
        },
        { 
          path: 'verify', 
          loadChildren: () => import('./auth/verify/verify.module').then(m => m.VerifyModule), 
          canActivate: [is_logged, is_authenticated, isNot_active] 
        },
        { 
          path: 'blocked', 
          loadChildren: () => import('./auth/blocked/blocked.module').then(m => m.BlockedModule), 
          canActivate: [is_logged, is_authenticated, is_active, isNot_employee] 
        },
        { 
          path: 'init', 
          loadChildren: () => import('./layouts/init/init.module').then(m => m.InitModule), 
          canActivate: [is_logged, is_authenticated, is_active, is_employee],
          resolve: { employee: InitResolver } 
        },
        { 
          path: 'settings', 
          loadChildren: () => import('./layouts/settings/settings.module').then(m => m.SettingsModule), 
          canActivate: [is_logged, is_authenticated],
          resolve: { employee: InitResolver } 
        },
        { 
          path: 'page-not-found', 
          loadChildren: () => import('./layouts/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) 
        },
        { 
          path: '**', 
          redirectTo: 'page-not-found', 
          pathMatch: 'full' 
        }
      ]
  },
  { path: 'ticket', loadChildren: () => import('./work-modules/ticket/ticket.module').then(m => m.TicketModule) },
  { path: 'employee', loadChildren: () => import('./work-modules/employee/employee.module').then(m => m.EmployeeModule) }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
