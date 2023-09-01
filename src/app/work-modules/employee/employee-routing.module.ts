import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeComponent } from './employee.component';

const routes: Routes = [
  { 
    path: '', 
    component: EmployeeComponent,
    children: [
      {
        path: 'employee-list',
        component: EmployeeListComponent
      }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
