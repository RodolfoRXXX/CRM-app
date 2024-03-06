import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit, AfterViewInit {

  displayedColumns!: string[];
  dataSource = new MatTableDataSource();
  resultsLength!: number;
  load!: boolean;
  recharge!: boolean;
  source!: any;
  is_large!: boolean;
  card_users: any = [];

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
    this.getUsers();
    this._paginator.itemsPerPageLabel = "Registros por página";
    this._paginator.firstPageLabel = "Primera página";
    this._paginator.lastPageLabel = "última página";
    this._paginator.nextPageLabel = "Próxima página";
    this._paginator.previousPageLabel = "Anterior página";
    this.source = environment.SERVER;
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Configuración/Roles y permisos')

    //Carga el detector de tamaño del dispositivo
    this._conector.getScreenState().subscribe( is_large => {
      this.is_large = is_large
      this.displayedColumns = (is_large)?['user', 'email', 'role', 'verified', 'status', 'view']:['user', 'role', 'verified', 'status', 'view'];
    } )

  }

  ngOnDestroy() {
    //Modifica el título de la vista principal al cerrar el componente
    this._conector.setUpdateTitle('Configuración')
  }

  getDataLocal(): Promise<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return data.id_enterprise;
  }

  getUsers(): void {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap((id) => {
          return this._api.postTypeRequest('profile/get-count-users', { id: id })
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
          return this._api.postTypeRequest('profile/get-users', { id: id, page: this.paginator.pageIndex, size: 10 })
                        .pipe(catchError(async () => {observableOf(null); this.recharge = true;}));
        }),
        map((data:any) => {
          this.load = false;
          if (data === null) {
            return [];
          }
          console.log(data)
          //Completa el array que completa las cards
          data.data.filter( (value:any) => value.role != null).forEach((element:any) => {
            if(!this.card_users.find( (value:any) => value.role == element.role )) {
              this.card_users.push({
                'role': element.role,
                'user': [element]
              })
            } else {
              this.card_users[this.card_users.findIndex( (value:any) => value.role == element.role )].user.push(element)
            }
          });
          return data;
        })
      )
      .subscribe((data: any) => (this.dataSource.data = data.data));
  }

  rechargeData() {
    this._conector.setUpdate(true);
  }

}
