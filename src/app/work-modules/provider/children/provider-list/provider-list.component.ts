import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest, of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss']
})
export class ProviderListComponent implements OnInit, AfterViewInit {

  employee!: Employee;
  resultsLength!: number;
  displayedColumns: string[] = ['detail', 'provider', 'phone', 'whatsapp', 'email', 'address', 'country', 'edit'];
  dataSource = new MatTableDataSource<any>();
  load = true;
  recharge = false;
  chips: any = { search: '' };
  card_values: any = { new_providers: null, debt: null, pending: null, returns: null };

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
    this._conector.setUpdateTitle('Lista de proveedores');
    this.getDataLocal();
  }

  getDataLocal(): void {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
      this.loadProviders();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProviders() {
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
    this._api.postTypeRequest('profile/get-provider-data', { id_enterprise: id_enterprise, date_limit: formattedDate }).subscribe((value: any) => {
      this.card_values.new_providers = value.data[0]?.data || 0;
      this.card_values.debt = value.data[1]?.data || 0;
      this.card_values.pending = value.data[2]?.data || 0;
      this.card_values.returns = value.data[3]?.data || 0;
    });
  }

  applyFilter() {
    const filters = Object.values(this.chips).filter(value => value !== '');
    this.dataSource.filter = filters.join(' ').trim().toLowerCase();
  }
  add(value: Event | string, key: string) {
    const chipStr = (typeof value === 'string') ? value : (value.target as HTMLInputElement).value;
    if (chipStr.trim().length > 0) {
      this.chips[key] = chipStr.trim().toLowerCase();
      this.applyFilter();
    }
  }
  delete(key: any) {
    this.chips[key] = '';
    this.applyFilter();
  }

  rechargeData() {
    this.loadProviders();
  }

  detailProvider(id_provider: Number) {
    console.log(id_provider)
    this._router.navigate(['init/main/provider/provider-detail'], { queryParams: { id_provider: id_provider } });
  }

  editProvider(id_provider: number) {
    this._router.navigate(['init/main/provider/provider-edit'], { queryParams: { id_provider: id_provider } });
  }

  sendWhatsapp(whatsapp: String) {
    let whatsappUrl = `https://wa.me/${whatsapp}`;
    window.open(whatsappUrl, '_blank');
  }

}

