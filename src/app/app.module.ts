import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FrameComponent } from './layouts/frame/frame.component';
import { SpinnerComponent } from './shared/spinner.component';
import { MaterialModule } from './material/material/material.module';
import { HeaderLoginComponent } from './layouts/frame/header-login/header-login.component';
import { HeaderRechargeComponent } from './layouts/frame/header-recharge/header-recharge.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    FrameComponent,
    SpinnerComponent,
    HeaderLoginComponent,
    HeaderRechargeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
