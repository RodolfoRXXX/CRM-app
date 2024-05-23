import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material/material.module';
import { SidebarComponent } from 'src/app/shared/standalone/sidebar/sidebar.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from 'src/app/services/interceptor.service';
import { DashboardComponent } from './children/dashboard/dashboard.component';


@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    SidebarComponent,
    ReactiveFormsModule
  ],
  exports: [
    
  ],
  providers: [
      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
      {
          provide: HTTP_INTERCEPTORS,
          useClass: InterceptorService,
          multi: true
      }
  ]
})
export class MainModule { }
