import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderComponent } from './provider.component';
import { ProviderListComponent } from './children/provider-list/provider-list.component';

const routes: Routes = [
  { path: '', component: ProviderComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'provider-list', 
        pathMatch: 'full' 
      },
      {
        path: 'provider-list',
        component: ProviderListComponent
      },
      { 
        path: '**',
        redirectTo: 'provider-list',
        pathMatch: 'full' }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule { }
