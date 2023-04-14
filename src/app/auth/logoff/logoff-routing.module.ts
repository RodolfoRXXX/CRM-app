import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoffComponent } from './logoff.component';

const routes: Routes = [{ path: '', component: LogoffComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogoffRoutingModule { }
