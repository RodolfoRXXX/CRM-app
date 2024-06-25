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
          path: 'product',
          loadChildren: () => import('../../../../work-modules/product/product.module').then(m => m.ProductModule)
        },
        {
          path: 'provider',
          loadChildren: () => import('../../../../work-modules/provider/provider.module').then(m => m.ProviderModule)
        },
        {
          path: 'storage',
          loadChildren: () => import('../../../../work-modules/storage/storage.module').then(m => m.StorageModule)
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
