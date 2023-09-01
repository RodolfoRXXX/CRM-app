import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketRoutingModule } from './ticket-routing.module';
import { TicketComponent } from './ticket.component';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { ListTicketComponent } from './components/list-ticket/list-ticket.component';
import { HistoricTicketComponent } from './components/historic-ticket/historic-ticket.component';


@NgModule({
  declarations: [
    TicketComponent,
    CreateTicketComponent,
    ListTicketComponent,
    HistoricTicketComponent
  ],
  imports: [
    CommonModule,
    TicketRoutingModule
  ]
})
export class TicketModule { }
