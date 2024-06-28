import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { StorageComponent } from './storage.component';
import { StorageListComponent } from './children/storage-list/storage-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material/material/material.module';
import { StorageEditComponent } from './children/storage-edit/storage-edit.component';


@NgModule({
  declarations: [
    StorageComponent,
    StorageListComponent,
    StorageEditComponent
  ],
  imports: [
    CommonModule,
    StorageRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule
  ]
})
export class StorageModule { }
