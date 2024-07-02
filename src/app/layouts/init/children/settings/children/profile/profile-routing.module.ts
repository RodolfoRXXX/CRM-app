import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileDetailComponent } from './children/profile-detail/profile-detail.component';
import { ProfileEditComponent } from './children/profile-edit/profile-edit.component';
import { ProfileResolver } from 'src/app/resolver/profile.resolver';

const routes: Routes = [
  { path: '', component: ProfileComponent, 
    children: [
      { 
        path: '', 
        redirectTo: 'profile-detail', 
        pathMatch: 'full' 
      },
      {
        path: 'profile-detail',
        component: ProfileDetailComponent,
        resolve: { profile: ProfileResolver }
      },
      {
        path: 'profile-edit',
        component: ProfileEditComponent,
        resolve: { profile: ProfileResolver }
      },
      { 
        path: '**',
        redirectTo: 'profile-detail',
        pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
