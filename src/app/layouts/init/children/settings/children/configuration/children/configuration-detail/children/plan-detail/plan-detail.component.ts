import { Component, Input, SimpleChanges } from '@angular/core';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrl: './plan-detail.component.scss'
})
export class PlanDetailComponent {

  @Input() enterprise!: Enterprise;
  planData!: any[];
  actualPlan!: any;

  constructor(
    private _getJson: GetJsonDataService,
  ) {
    this._getJson.getData('plan_detail.json').subscribe((data: any) => {
      this.planData = data;
    });
  }

  ngOnInit(): void {
    
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
    this.actualPlan = this.planData.find(value => value.id === this.enterprise.plan);
  }

}
