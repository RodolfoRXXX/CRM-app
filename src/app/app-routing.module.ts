import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrameComponent } from './layouts/frame/frame.component';

const routes: Routes = [
  { path: '', component: FrameComponent,
      children: [
        { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) },
        { path: 'register', loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule) },
        { path: 'recharge', loadChildren: () => import('./auth/recharge/recharge.module').then(m => m.RechargeModule) },
        { path: 'forget', loadChildren: () => import('./auth/forget/forget.module').then(m => m.ForgetModule) },
        { path: 'logoff', loadChildren: () => import('./auth/logoff/logoff.module').then(m => m.LogoffModule) },
        { path: 'blocked', loadChildren: () => import('./auth/blocked/blocked.module').then(m => m.BlockedModule) },
        { path: 'init', loadChildren: () => import('./layouts/init/init.module').then(m => m.InitModule) },
        { path: 'page-not-found', loadChildren: () => import('./layouts/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) },
      ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
