import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileDetailComponent } from './children/profile-detail/profile-detail.component';
import { ProfileEditComponent } from './children/profile-edit/profile-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material/material.module';
import { ProfileInformationComponent } from './children/profile-edit/children/profile-information/profile-information.component';
import { ProfileImageComponent } from './children/profile-edit/children/profile-image/profile-image.component';
import { ProfileWorkingHoursComponent } from './children/profile-edit/children/profile-working-hours/profile-working-hours.component';
import { ProfileErContactComponent } from './children/profile-edit/children/profile-er-contact/profile-er-contact.component';
import { ProfileViewComponent } from "../../../../../../shared/standalone/view/profile-view/profile-view.component";
import { NgModule } from '@angular/core';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileDetailComponent,
    ProfileEditComponent,
    ProfileInformationComponent,
    ProfileImageComponent,
    ProfileWorkingHoursComponent,
    ProfileErContactComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileViewComponent
]
})
export class ProfileModule { }
