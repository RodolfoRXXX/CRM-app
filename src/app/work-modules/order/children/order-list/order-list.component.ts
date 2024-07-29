import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit {

  employee!: Employee;
  displayedColumns: string[] = ['id', 'date', 'customer', 'status', 'detail'];
  dataSource = new MatTableDataSource();
  resultsLength!: number;
  load_card1 = false;
  load_card2 = false;
  load_card3 = false;
  load_card4 = false;
  load = true;
  recharge = false;
  chips: any = { search: '', status: '' };
  card_values: any = { d1: null, d2: null, d4: null, d5: null };
  permissions: string[] = [];
  add_product_admin = '6';
  uriImg = environment.SERVER;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  seller!: number;

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
    private _paginatorIntl: MatPaginatorIntl,
    private _router: Router
  ) {
    this.initPaginatorLabels();
    this.getOrders();
  }

  ngOnInit(): void {
    this._conector.setUpdateTitle('Lista de pedidos');
  }

  private initPaginatorLabels(): void {
    this._paginatorIntl.itemsPerPageLabel = "Registros por página";
    this._paginatorIntl.firstPageLabel = "Primera página";
    this._paginatorIntl.lastPageLabel = "Última página";
    this._paginatorIntl.nextPageLabel = "Próxima página";
    this._paginatorIntl.previousPageLabel = "Anterior página";
  }

  private getDataLocal(): number {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
      if(item.name_role !== 'administrador') {
        this.seller = item.id;
      }
      this.permissions = item.list_of_permissions.split(',');
    });
    return this.employee.id_enterprise;
  }

  private getOrders(): void {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap(id_enterprise => {
          this.getDataCard(id_enterprise);
          return this._api.postTypeRequest('profile/get-count-orders', { id_enterprise, seller: this.seller })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => this.resultsLength = data.data[0].total);
  }

  private getDataCard(id_enterprise: number): void {
    const date_limit = this.calculateDateLimit(365);
    this._api.postTypeRequest('profile/get-orders-data', { id_enterprise, date_limit }).subscribe((value: any) => {
      this.card_values.d1 = value.data[0]?.d1 || 0;
      this.card_values.d2 = value.data[0]?.d2 || 0;
      this.card_values.d4 = value.data[0]?.d4 || 0;
      this.card_values.d5 = value.data[0]?.d5 || 0;
    });
  }

  private calculateDateLimit(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  applyFilter(): void {
    const filters = Object.values(this.chips).filter(value => value).join(' ');
    this.dataSource.filter = filters || '';
  }
  add(value: string | Event, key: string): void {
    const chipValue = typeof value === 'string' ? value : (value.target as HTMLInputElement).value;
    if (chipValue.trim()) {
      this.chips[key] = chipValue.trim().toLowerCase();
      this.applyFilter();
    }
  }
  delete(key: any): void {
    this.chips[key] = '';
    this.applyFilter();
  }

  ngAfterViewInit(): void {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap(id_enterprise => {
          this.recharge = false;
          this.load = true;
          return this._api.postTypeRequest('profile/get-orders', { id_enterprise, page: this.paginator.pageIndex, size: 10, seller: this.seller })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        this.load = false;
        if (data.data) {
          data.data.forEach((element: any) => {
            if(element.status == 1) {
              element.status = 'Abierto';
            } else if(element.status == 0) {
              element.status = 'Cerrado';
            }
          });
          this.dataSource.data = data.data;
        } 
      });

    this.dataSource.sort = this.sort;
  }

  openDetail(id_order: number) {
    this._router.navigate(['init/main/order/order-detail'], { queryParams: { id_order: id_order } });
  }

  rechargeData(): void {
    this.ngAfterViewInit();
  }
}

