import { Component } from '@angular/core';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-total-sales-card',
  templateUrl: './total-sales-card.component.html',
  styleUrls: ['./total-sales-card.component.scss']
})
export class TotalSalesCardComponent {

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
      if(item.name_role !== 'administrador') {
        this.seller = item.id;
      } else {
        this.seller = null;
      }
    });
    return this.employee.id_enterprise;
  }

  private calculateDateLimit(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getInfo(range: number): void {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap(id_enterprise => {
          const date_limit = this.calculateDateLimit(range);
          return this._api.postTypeRequest('profile/get-data-total-sale', { id_enterprise, date_limit, seller: this.seller })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        if((data.status == 1) && data.data[0].response) {
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
