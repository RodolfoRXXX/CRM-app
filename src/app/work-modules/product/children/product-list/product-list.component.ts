import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Category } from 'src/app/shared/interfaces/category.interface';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {

  title!: string;
  sector!: string;
  employee!: Employee;
  categories!: Category[];
  displayedColumns: string[] = ['detail', 'product', 'category', 'stock_real', 'state_stock', 'sale_price', 'sku', 'state'];
  dataSource = new MatTableDataSource();
  resultsLength!: number;
  load_card1!: boolean;
  load_card2!: boolean;
  load_card3!: boolean;
  load_card4!: boolean;
  load!: boolean;
  recharge!: boolean;
  empty_products!: boolean;
  chips: any = {category: '', stock: '', state: '', search: ''};
  card_values: any = {products_with_stock: null, value_stock: null, products_without_stock: null, immo_stock: null}

  uriImg = environment.SERVER;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _conector: ConectorsService,
    private _paginator: MatPaginatorIntl
  ) {
    this.load = true;
    this.recharge = false;
    this.empty_products = false;
    this.getProducts();
    this._paginator.itemsPerPageLabel = "Registros por página";
    this._paginator.firstPageLabel = "Primera página";
    this._paginator.lastPageLabel = "última página";
    this._paginator.nextPageLabel = "Próxima página";
    this._paginator.previousPageLabel = "Anterior página";
  }
  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Lista de productos')
  }

  getDataLocal(): number {
    this._conector.getEmployee().subscribe( (item:Employee) => {
      this.employee = item
    })
    return this.employee.id_enterprise;
  }

  getProducts(): void {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap((id_enterprise) => {
          this.getDataCard(id_enterprise);
          this.getCategories(id_enterprise);
          return this._api.postTypeRequest('profile/get-count-products', { id_enterprise: id_enterprise })
                        .pipe(catchError(async () => {observableOf(null); this.recharge = true;}));
        }),
        map(data => {
          return data;
        })
      )
    .subscribe((data: any) => this.resultsLength = data.data[0].total);
  }

  getCategories(id_enterprise: number): void {
    this._api.postTypeRequest('profile/get-categories', { id_enterprise: id_enterprise }).subscribe( (value:any) => {
      this.categories = value.data
    })
  }

  getDataCard(id_enterprise: number) {

    let fecha = new Date();
    fecha.setDate(fecha.getDate() - 60);
    // Obtener el año, mes y día de la fecha actual.
    let año = fecha.getFullYear();
    let mes = fecha.getMonth() + 1; // Los meses van de 0 a 11, así que sumamos 1.
    let dia = fecha.getDate();
    let _dia;
    let _mes;
    if(dia < 10) {
      _dia = '0' + dia
    } else {
      _dia = dia
    }
    if(mes < 10) {
      _mes = '0' + mes
    } else {
      _mes = mes
    }

    // Formatear la fecha como texto según tus preferencias.
    let date_limit = año + '-' + _mes + '-' + _dia;
    this._api.postTypeRequest('profile/get-products-data', { id_enterprise: id_enterprise, date_limit: date_limit }).subscribe( (value:any) => {
      (value.data[0].data)?this.card_values.products_with_stock = value.data[0].data:this.card_values.products_with_stock = 0;
      (value.data[1].data)?this.card_values.value_stock = value.data[1].data:this.card_values.value_stock = 0;
      (value.data[2].data)?this.card_values.products_without_stock = value.data[2].data:this.card_values.products_without_stock = 0;
      (value.data[3].data)?this.card_values.immo_stock = value.data[3].data:this.card_values.immo_stock = 0;
    })
  }

  applyFilter() {
    let i = 0;
    for (let key in this.chips){
      this.chips[key]?this.dataSource.filter = this.chips[key]:i++;
    }
    (i == 4)?this.dataSource.filter = '':'';
  }
  add(value: Event, key: string) {
    let chip_str

    //Verifica que el value que entra sea un string o un evento
    if(typeof value != 'string') {
      //Si es un evento entonces lo lee como tal y recupera el string 
      chip_str = ((value.target as HTMLInputElement).value);
    } else {
      //Si es un string entonces lo pasa como tal
      chip_str = value
    }
    //Primero verifica que la variable interna asignada tenga un valor
    if(chip_str.length > 0) {
      this.chips[key] = chip_str.trim().toLowerCase();
      this.applyFilter();
    }
  }
  delete(key: any) {
    //Recibe la clave que debe borrar tomada desde el chip que representa el filtro aplicado y revaloriza el objeto chips a cadena vacía
    this.chips[key] = ''
    this.applyFilter();
  }

  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap((id_enterprise) => {
          this.recharge = false;
          this.load = true;
          return this._api.postTypeRequest('profile/get-products', { id_enterprise: id_enterprise, page: this.paginator.pageIndex, size: 10 })
                        .pipe(catchError(async () => {observableOf(null); this.recharge = true;}));
        }),
        map(data => {
          this.load = false;
          if (data === null) {
            this.empty_products = true;
            return [];
          }
          return data;
        })
      )
      .subscribe((data: any) => (this.dataSource.data = data.data));
      this.dataSource.sort = this.sort;
  }

  openDialogDetail(id_product: number) {
    console.log(id_product)
  }

  rechargeData() {
    this._conector.setUpdate(true);
  }

}
