import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html'
})
export class BillingComponent implements AfterViewInit {

  displayedColumns: string[] = ['position', 'date', 'amount', 'state', 'bill'];
  dataSource = new MatTableDataSource();
  resultsLength!: number;
  load!: boolean;
  recharge!: boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _conector: ConectorsService,
    private _paginator: MatPaginatorIntl
  ) {
    this.resultsLength = 0;
    this.load = true;
    this.recharge = false;
    this.getCountBills();
    this._paginator.itemsPerPageLabel = "Registros por página";
    this._paginator.firstPageLabel = "Primera página";
    this._paginator.lastPageLabel = "última página";
    this._paginator.nextPageLabel = "Próxima página";
    this._paginator.previousPageLabel = "Anterior página";
  }

  getDataLocal(): Promise<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return data.id_enterprise;
  }

  getCountBills(): void {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap((id) => {
          return this._api.postTypeRequest('profile/get-count-bills', { id: id })
                        .pipe(catchError(async () => {observableOf(null); this.recharge = true;}));
        }),
        map(data => {
          return data;
        })
      )
    .subscribe((data: any) => this.resultsLength = data.data[0].total);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap((id) => {
          this.recharge = false;
          this.load = true;
          return this._api.postTypeRequest('profile/get-bills', { id: id, page: this.paginator.pageIndex, size: 10 })
                        .pipe(catchError(async () => {observableOf(null); this.recharge = true;}));
        }),
        map(data => {
          this.load = false;
          if (data === null) {
            return [];
          }
          return data;
        })
      )
      .subscribe((data: any) => (this.dataSource.data = data.data));
  }

  rechargeData() {
    this._conector.setUpdate(true);
  }

}

