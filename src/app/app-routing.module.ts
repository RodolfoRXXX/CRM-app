import { NgModule } from '@angular/core';
import { FrameComponent } from './layouts/frame/frame.component';
import { isNot_active, isNot_authenticated, isNot_logged, is_active, is_authenticated, is_logged } from './guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: FrameComponent,
      children: [
        { path: '', redirectTo: 'recharge', pathMatch: 'full' },
        { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule), canActivate: [isNot_logged, isNot_authenticated] },
        { path: 'register', loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterModule), canActivate: [isNot_logged, isNot_authenticated] },
        { path: 'recharge', loadChildren: () => import('./auth/recharge/recharge.module').then(m => m.RechargeModule), canActivate: [is_logged, isNot_authenticated] },
        { path: 'forget', loadChildren: () => import('./auth/forget/forget.module').then(m => m.ForgetModule), canActivate: [isNot_logged, isNot_authenticated] },
        { path: 'logoff', loadChildren: () => import('./auth/logoff/logoff.module').then(m => m.LogoffModule), canActivate: [is_logged] },
        { path: 'blocked', loadChildren: () => import('./auth/blocked/blocked.module').then(m => m.BlockedModule), canActivate: [is_logged, is_authenticated, isNot_active] },
        { path: 'init', loadChildren: () => import('./layouts/init/init.module').then(m => m.InitModule), canActivate: [is_logged, is_authenticated, is_active] },
        { path: 'settings', loadChildren: () => import('./layouts/settings/settings.module').then(m => m.SettingsModule), canActivate: [is_logged, is_authenticated] },
        { path: 'page-not-found', loadChildren: () => import('./layouts/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule) },
        { path: '**', redirectTo: 'page-not-found', pathMatch: 'full' }
      ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
