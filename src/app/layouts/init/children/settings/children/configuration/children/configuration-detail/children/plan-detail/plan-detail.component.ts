import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.scss']
})
export class PlanDetailComponent implements OnInit {

  @Input() enterprise!: Enterprise;
  planData!: any[];
  actualPlan!: any;
  isLoading: boolean = true;

  constructor(private _getJson: GetJsonDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enterprise'] && this.enterprise) {
      this.updateCard();
    }
  }

  private loadData(): void {
    this._getJson.getData('plan_detail.json').subscribe((data: any) => {
      this.planData = data;
      this.updateCard();
    });
  }

  private updateCard(): void {
    if (this.planData && this.enterprise) {
      const data = this.planData.find(value => value.id === this.enterprise.plan);
      if (data) {
        this.actualPlan = data;
        this.isLoading = false;
      }
    }
  }
}

