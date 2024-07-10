import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest, of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DialogConfirmOperationComponent } from 'src/app/shared/standalone/dialog/dialog-confirm-operation/dialog-confirm-operation.component';

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
  card_values: any = { new_providers: null, debt: null, pending: null, returns: null };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
    private _paginator: MatPaginatorIntl,
    private _router: Router,
    private _dialog: MatDialog
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  rechargeData() {
    this.loadProviders();
  }

  detailProvider(id_provider: Number) {
    this._router.navigate(['init/main/provider/provider-detail'], { queryParams: { id_provider: id_provider } });
  }

  editProvider(id_provider: number) {
    this._router.navigate(['init/main/provider/provider-edit'], { queryParams: { id_provider: id_provider } });
  }

  openDialogWhatsapp(whatsapp: String): void {
    const dialogRef = this._dialog.open(DialogConfirmOperationComponent,
      { data: { 
                text: `Estás por entrar a una conversación con ${whatsapp}`,
                icon_name: 'info_outline',
                icon_color: 'rgb(231, 234, 33)'
              }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        //Aquí abre una conversación de whatsapp con la aplicación original
        //en un futuro abrirá uina conversación por whatsapp desde esta aplicación, cuando esté integrada
        window.open(`https://wa.me/${whatsapp}`, '_blank');
      }
    });
  }

}

