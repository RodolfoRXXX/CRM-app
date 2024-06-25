import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorageComponent } from './storage.component';
import { StorageListComponent } from './children/storage-list/storage-list.component';

const routes: Routes = [
  { path: '', component: StorageComponent,
    children: [
      { 
        path: '', 
        redirectTo: 'storage-list', 
        pathMatch: 'full' 
      },
      {
        path: 'storage-list',
        component: StorageListComponent
      },
      { 
        path: '**',
        redirectTo: 'storage-list',
        pathMatch: 'full' }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
