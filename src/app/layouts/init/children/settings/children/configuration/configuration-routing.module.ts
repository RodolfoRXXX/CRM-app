import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationDetailComponent } from './children/configuration-detail/configuration-detail.component';
import { PricingComponent } from './children/pricing/pricing.component';

const routes: Routes = [
  { 
    path: '', component: ConfigurationComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'configuration-detail', 
        pathMatch: 'full' 
      },
      {
        path: 'configuration-detail',
        component: ConfigurationDetailComponent
      },
      { 
        path: 'pricing',
        component: PricingComponent
      },
      { 
        path: '**',
        redirectTo: 'configuration-detail',
        pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
