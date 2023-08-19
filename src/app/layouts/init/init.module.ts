import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InitRoutingModule } from './init-routing.module';
import { InitComponent } from './init.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material/material.module';
import { SidebarComponent } from 'src/app/shared/standalone/sidebar/sidebar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { InterceptorService } from 'src/app/services/interceptor.service';
import { UpdateDirective } from 'src/app/shared/directives/update/update.directive';


@NgModule({
  declarations: [
    InitComponent,
    UpdateDirective
  ],
  imports: [
    CommonModule,
    InitRoutingModule,
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
export class InitModule { }
