import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { calculateDateLimit } from 'src/app/shared/functions/date.function';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { environment, permissions } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit {

  employee!: Employee;
  sellers!: any;
  displayedColumns: string[] = ['id', 'date', 'customer', 'seller', 'status'];
  dataSource = new MatTableDataSource();
  resultsLength!: number;
  loadCards: boolean = true;
  load = true;
  recharge = false;
  chips: any = { search: '', status: '', seller: '' };
  //d1: pendientes, d2: entregados, d3: devoluciones, d4: cancelaciones
  card_values: any = { d1: null, d2: null, d4: null, d5: null };
  uriImg = environment.SERVER;
  edit_enterprise_control = permissions.EDIT_ENTERPRISE_CONTROL;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  seller!: number | null;

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
      if(!item.list_of_permissions.includes(this.edit_enterprise_control)) {
        this.seller = item.id;
      } else {
        this.seller = null;
        this.getSellers(item.id_enterprise)
      }
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
    const date_limit = calculateDateLimit(365);
    this._api.postTypeRequest('profile/get-orders-data', { id_enterprise, date_limit, seller: this.seller }).subscribe((value: any) => {
      if(value.data) {
        value.data.forEach((item: any) => {
          switch (item.status_value) {
            case '1':
              this.card_values.d1 = item.count_status
              break;
            case '2':
              this.card_values.d2 = item.count_status
              break;
            case '4':
              this.card_values.d4 = item.count_status
              break;
            case '5':
              this.card_values.d5 = item.count_status
              break;
          }
        });
      } else {
        this.card_values = {
          d1 : 0,
          d2 : 0,
          d3 : 0,
          d4 : 0
        }
      }
      this.loadCards = false;
    });
  }

  private getSellers(id_enterprise: number) {
    this._api.postTypeRequest('profile/get-enterprise-users', { id_enterprise }).subscribe((value: any) => {
      if(value) {
        this.sellers = value.data;
      }
    });
  }

  getEmployeeDisplayName(item: any): string {
    return item.name_employee || item.email.split("@")[0];
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

  //Función que toma la fila clickeada del table eligiendo esa opción
  onRowClicked(row: any) {
    if(row) {
      this._router.navigate(['init/main/order/order-detail'], { queryParams: { id_order: row.id } });
    }
  }

  rechargeData(): void {
    this.ngAfterViewInit();
  }
}

