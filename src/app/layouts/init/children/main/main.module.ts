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
import { GreetingCardComponent } from './children/greeting-card/greeting-card.component';
import { OpenOrderCardComponent } from './children/open-order-card/open-order-card.component';
import { PendingProductCardComponent } from './children/pending-product-card/pending-product-card.component';
import { BalanceCardComponent } from './children/balance-card/balance-card.component';
import { TotalSalesCardComponent } from './children/total-sales-card/total-sales-card.component';
import { ReturnsCardComponent } from './children/returns-card/returns-card.component';
import { CancelationsCardComponent } from './children/cancelations-card/cancelations-card.component';
import { ChartModule } from 'primeng/chart';
import { ProductsCardComponent } from './children/products-card/products-card.component';


@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent,
    GreetingCardComponent,
    OpenOrderCardComponent,
    PendingProductCardComponent,
    BalanceCardComponent,
    TotalSalesCardComponent,
    ReturnsCardComponent,
    CancelationsCardComponent,
    ProductsCardComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule,
    SidebarComponent,
    ReactiveFormsModule,
    ChartModule
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
