import { NgModule } from '@angular/core';
import { FrameComponent } from './layouts/frame/frame.component';
import { auth_authenticated, auth_logged } from './guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: FrameComponent,
      children: [
        { path: '', redirectTo: 'recharge', pathMatch: 'full' },
        { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) },
        { path: 'register', loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule) },
        { path: 'recharge', loadChildren: () => import('./auth/recharge/recharge.module').then(m => m.RechargeModule), canActivate: [auth_logged] },
        { path: 'forget', loadChildren: () => import('./auth/forget/forget.module').then(m => m.ForgetModule) },
        { path: 'logoff', loadChildren: () => import('./auth/logoff/logoff.module').then(m => m.LogoffModule), canActivate: [auth_logged, auth_authenticated] },
        { path: 'blocked', loadChildren: () => import('./auth/blocked/blocked.module').then(m => m.BlockedModule), canActivate: [auth_logged, auth_authenticated] },
        { path: 'init', loadChildren: () => import('./layouts/init/init.module').then(m => m.InitModule), canActivate: [auth_logged, auth_authenticated] },
        { path: 'page-not-found', loadChildren: () => import('./layouts/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) },
        { path: '**', redirectTo: 'page-not-found', pathMatch: 'full' }
      ]
  },
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
