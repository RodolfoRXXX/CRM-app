import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderComponent } from './provider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material/material/material.module';
import { ProviderListComponent } from './children/provider-list/provider-list.component';
import { ProviderDetailComponent } from './children/provider-detail/provider-detail.component';
import { ProviderEditComponent } from './children/provider-edit/provider-edit.component';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    ProviderComponent,
    ProviderListComponent,
    ProviderDetailComponent,
    ProviderEditComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule
  ]
})
export class ProviderModule { }
