import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { catchError, combineLatest, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.scss']
})
export class ProviderDetailComponent implements OnInit {

  employee!: Employee;
  resultsLength!: number;
  displayedColumns: string[] = ['order', 'date', 'status', 'ammount'];
  dataSource = new MatTableDataSource<any>();
  load = true;
  recharge = false;
  chips: any = { search: '' };

  isFlat: boolean = true;

  toggleButtonStyle() {
    this.isFlat = !this.isFlat;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
    private _paginator: MatPaginatorIntl,
    private _router: Router
  ) {
    this._paginator.itemsPerPageLabel = "Registros por página";
    this._paginator.firstPageLabel = "Primera página";
    this._paginator.lastPageLabel = "última página";
    this._paginator.nextPageLabel = "Próxima página";
    this._paginator.previousPageLabel = "Anterior página";
  }

  ngOnInit(): void {
    this._conector.setUpdateTitle('Detalle del proveedor');
    this.getDataLocal();
  }

  getDataLocal(): void {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
      this.loadProvider();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProvider() {
    this.load = true;
    combineLatest([
      this._api.postTypeRequest('profile/get-count-providers', { id_enterprise: this.employee.id_enterprise }),
      this._api.postTypeRequest('profile/get-providers', { id_enterprise: this.employee.id_enterprise })
    ]).pipe(
      catchError(() => {
        this.recharge = true;
        return observableOf(null);
      })
    ).subscribe(([countResponse, providersResponse]: any) => {
      this.recharge = false;
      this.load = false;
      if (countResponse) {
        this.resultsLength = countResponse.data[0].total;
      }
      if (providersResponse) {
        this.dataSource.data = providersResponse.data;
      }
    });
  }

  getDataCard(id_enterprise: number) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 60);
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const day = fecha.getDate();
    const formattedDate = `${year}-${(month < 10 ? '0' : '') + month}-${(day < 10 ? '0' : '') + day}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  rechargeData() {
    this.loadProvider();
  }

}
