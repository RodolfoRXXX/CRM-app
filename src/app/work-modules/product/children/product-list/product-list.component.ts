import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee, empty_employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {

  title!: string;
  sector!: string;
  employee!: Employee;
  displayedColumns: string[] = ['position', 'date', 'amount', 'state', 'bill'];
  dataSource = new MatTableDataSource();
  resultsLength!: number;
  load!: boolean;
  recharge!: boolean;
  chips: any[] = [
    {category: ''},
    {stock: ''},
    {state: ''},
    {search: ''},
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _actRoute: ActivatedRoute,
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
  ngOnInit(): void {
    //Recibe los datos del resolver y carga los datos en la vista
    this.employee = this._actRoute.snapshot.data['employee'].data[0];
    if(this.employee) {
      this._conector.setEmployee(this.employee);
    } else {
      this.employee = empty_employee;
    }

    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Lista de productos')
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

  applyFilter() {
    if(this.chips.length > 0) {
      this.chips.forEach(element => {
        this.dataSource.filter = element;
      });
    } else {
      this.dataSource.filter = '';
    }
  }
  add(value: Event, key: string) {
    let chip_str
    if(typeof value != 'string') {
      chip_str = ((value.target as HTMLInputElement).value).trim().toLowerCase();
    } else {
      chip_str = value
    }

    if(chip_str.length > 0) {

      //index = this.chips.indexOf(chip_str);
      //(index == -1)?this.chips.push(chip_str):'';
      //this.applyFilter();
    }
  }
  delete(value: string, i: any) {
      this.chips.splice(i, 1);
    console.log(value, i)
    this.applyFilter();
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
function observableOf(arg0: null) {
  throw new Error('Function not implemented.');
}

