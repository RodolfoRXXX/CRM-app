import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { HistoricTicketComponent } from './components/historic-ticket/historic-ticket.component';
import { ListTicketComponent } from './components/list-ticket/list-ticket.component';
import { TicketComponent } from './ticket.component';

const routes: Routes = [
  {
    path: '',
    component: TicketComponent,
    children: [
      { 
        path: 'create-ticket', 
        component: CreateTicketComponent 
      },
      { 
        path: 'list-ticket', 
        component: ListTicketComponent
      },
      { 
        path: 'historic-ticket', 
        component: HistoricTicketComponent
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
