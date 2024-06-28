import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { combineLatest, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DialogStorageDetailComponent } from 'src/app/shared/standalone/dialog/dialog-storage-detail/dialog-storage-detail.component';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.scss']
})
export class StorageListComponent {

  employee!: Employee;
  resultsLength!: number;
  displayedColumns: string[] = ['detail', 'id', 'name', 'phone', 'address', 'city', 'state', 'country', 'status', 'edit'];
  dataSource = new MatTableDataSource<any>();
  load = true;
  recharge = false;

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
    this._conector.setUpdateTitle('Lista de depósitos');
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
      this._api.postTypeRequest('profile/get-count-storages', { id_enterprise: this.employee.id_enterprise }),
      this._api.postTypeRequest('profile/get-storages', { id_enterprise: this.employee.id_enterprise })
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  rechargeData() {
    this.loadProviders();
  }

  openDialogDetail(id_storage: number): void {
    const dialogRef = this._dialog.open(DialogStorageDetailComponent, { data: { id_storage: id_storage } });
  }

  editStorage(id_storage: number) {
    this._router.navigate(['init/main/storage/storage-edit'], { queryParams: { id_storage: id_storage } });
  }

}
