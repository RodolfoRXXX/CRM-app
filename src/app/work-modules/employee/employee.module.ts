import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { MaterialModule } from 'src/app/material/material/material.module';


@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeListComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    MaterialModule
  ]
})
export class EmployeeModule { }
