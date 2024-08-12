import { Component } from '@angular/core';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { calculateDateLimit } from 'src/app/shared/functions/date.function';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { permissions } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-pending-product-card',
  templateUrl: './pending-product-card.component.html',
  styleUrls: ['./pending-product-card.component.scss']
})
export class PendingProductCardComponent {

  employee!: Employee;
  seller!: number | null;
  info!: number | null;
  textRange: string = 'Ultimos 30 días';

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
  ) {
    this.getInfo(30);
  }

  private getDataLocal(): number {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
      if(!item.list_of_permissions.includes(permissions.EDIT_ENTERPRISE_CONTROL)) {
        this.seller = item.id;
      } else {
        this.seller = null;
      }
    });
    return this.employee.id_enterprise;
  }

  private getInfo(range: number): void {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap(id_enterprise => {
          const date_limit = calculateDateLimit(range);
          return this._api.postTypeRequest('profile/get-data-pending-product', { id_enterprise, date_limit, seller: this.seller })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        if((data.status == 1) && data.data) {
          this.info = data.data[0].response
        } else {
          this.info = 0
        }
      } );
  }

  setRange(range: number, text: string) {
    this.info = null;
    this.textRange = text;
    this.getInfo(range);
  }

}
