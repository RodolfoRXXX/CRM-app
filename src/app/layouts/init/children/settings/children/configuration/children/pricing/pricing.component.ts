import { Component, OnInit } from '@angular/core';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  load!: boolean;
  employee!: Employee;
  enterprise!: Enterprise;
  planData!: any[];

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
    private _getJson: GetJsonDataService
  ) {
    this.load = true;
    this._getJson.getData('plan_detail.json').subscribe((data: any) => {
      this.planData = data;
    });
  }
  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Precio de los planes')
    this.getEnterprise()
  }

  private getDataLocal(): number {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
    });
    return this.employee.id_enterprise;
  }

  getEnterprise() {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap(id_enterprise => {
          return this._api.postTypeRequest('profile/get-enterprise', { id: id_enterprise })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        if((data.status == 1) && data.data[0]) {
          this.enterprise = data.data[0]
        }
      } );
  }

}

