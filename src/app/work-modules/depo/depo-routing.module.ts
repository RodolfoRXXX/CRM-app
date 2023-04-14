import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepoComponent } from './depo.component';

const routes: Routes = [{ path: '', component: DepoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepoRoutingModule { }
