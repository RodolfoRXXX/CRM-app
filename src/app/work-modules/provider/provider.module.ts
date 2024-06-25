import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderComponent } from './provider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material/material/material.module';
import { ProviderListComponent } from './children/provider-list/provider-list.component';


@NgModule({
  declarations: [
    ProviderComponent,
    ProviderListComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule
  ]
})
export class ProviderModule { }