import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { diasHastaFinDeMes, esMismoOMesPosterior, getMonthNameForDate } from 'src/app/shared/functions/date.function';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';

@Component({
  selector: 'app-plan-remains',
  templateUrl: './plan-remains.component.html',
  styleUrl: './plan-remains.component.scss'
})
export class PlanRemainsComponent implements OnInit {

  @Input() enterprise!: Enterprise;
  remains: number = 0;
  period!: string;
  statusPlan!: string;
  statusAccount!: string;

  ngOnInit(): void {
    this.remains = diasHastaFinDeMes();
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['enterprise']) {
      if(this.enterprise) {
        this.setCard()
      }
    }
  }

  setCard() {
    this.period = getMonthNameForDate(this.enterprise.updatedPayment)
    this.statusAccount = (this.enterprise.status == 1)?'Activo':'Inactivo';
    this.statusPlan = (esMismoOMesPosterior(this.enterprise.updatedPayment))?'Al día':'Atrasado';
  }

}
