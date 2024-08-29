import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { calculateDateLimit, isNewerThan30Days } from 'src/app/shared/functions/date.function';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DialogProductDetailComponent } from 'src/app/shared/standalone/dialog/dialog-product-detail/dialog-product-detail.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  isNewerThan30Days = isNewerThan30Days;

  @ViewChild('search') search!: ElementRef;
  @ViewChild('category') category!: ElementRef;
  @ViewChild('is_stock') is_stock!: ElementRef;
  @ViewChild('state') state!: ElementRef;

  employee!: Employee;
  categories!: any[];
  filters!: any[];
  displayedColumns: string[] = ['detail', 'product', 'category', 'stock_real', 'rotation', 'sale_price', 'sku', 'state'];
  dataSource = new MatTableDataSource();
  resultsLength!: number;
  load: boolean = true;
  recharge: boolean = false;
  empty_products: boolean = false;
  chips: any = {};
  chips_arr: any = {};
  card_values: any = {products_with_stock: null, value_stock: null, products_without_stock: null, immo_stock: null};
  permissions: string[] = [];
  add_product_admin = environment.EDIT_PRODUCT_CONTROL;

  uriImg = environment.SERVER;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
    private _paginator: MatPaginatorIntl,
    private _dialog: MatDialog,
    private _router: Router
  ) {
    this.initPaginatorLabels()
  }

  private initPaginatorLabels(): void {
    this._paginator.itemsPerPageLabel = "Registros por página";
    this._paginator.firstPageLabel = "Primera página";
    this._paginator.lastPageLabel = "Última página";
    this._paginator.nextPageLabel = "Próxima página";
    this._paginator.previousPageLabel = "Anterior página";
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Lista de productos')
    this.getDataLocal()
  }

  //Getters
  getDataLocal() {
    this._conector.getEmployee().subscribe( (item:Employee) => {
      this.employee = item
      this.permissions = item.list_of_permissions.split(',')
      this.loadData()
      this.getTags(this.employee.id_enterprise)
      this.getCategories(this.employee.id_enterprise)
      this.getDataCard(this.employee.id_enterprise)
    })
  }
  getCategories(id_enterprise: number): void {
    this._api.postTypeRequest('profile/get-categories', { id_enterprise: id_enterprise }).subscribe( (value:any) => {
      if(value.data) {
        this.categories = value.data
        this.categories.forEach((item: any) => {
        item.color_badge = JSON.parse(item.color_badge)
      });
      }
    })
  }
  getTags(id_enterprise: number): void {
    this._api.postTypeRequest('profile/get-filters-obj', { id_enterprise: id_enterprise }).subscribe( (value:any) => {
      if(value.data) {
        value.data.forEach((element: any) => {
          element.filter_values = JSON.parse(element.filter_values)
        });
        this.filters = value.data;
      }
    })
  }
  getDataCard(id_enterprise: number) {
    let date_limit = calculateDateLimit(60);
    this._api.postTypeRequest('profile/get-products-data', 
                      { id_enterprise: id_enterprise, date_limit: date_limit }).subscribe( (value:any) => {
      if(value.status == 1) {
        this.card_values.products_with_stock = (value.data[0].stock != null)?value.data[0].stock:0;
        this.card_values.value_stock = (value.data[0].stock_price != null)?value.data[0].stock_price:0;
        this.card_values.products_without_stock = (value.data[0].nostock != null)?value.data[0].nostock:0;
        this.card_values.immo_stock = (value.data[0].nostock_price != null)?value.data[0].nostock_price:0;
      } else {
        this.card_values.products_with_stock = 0;
        this.card_values.value_stock = 0;
        this.card_values.products_without_stock = 0;
        this.card_values.immo_stock = 0;
      }
    })
  }

  //Función que trae los valores desde la DB
  loadData(): void {
    if (this.employee.id_enterprise) {
      this.empty_products = false;
      this.load = true;
      forkJoin({
        count: this._api.postTypeRequest('profile/get-count-products', 
          { id_enterprise: this.employee.id_enterprise, search: this.chips_arr.search, category: this.chips_arr.category, is_stock: this.chips_arr.is_stock, state: this.chips_arr.state, filters: this.chips_arr.filters }),
        products: this._api.postTypeRequest('profile/get-products', 
          { id_enterprise: this.employee.id_enterprise, search: this.chips_arr.search, category: this.chips_arr.category, is_stock: this.chips_arr.is_stock, state: this.chips_arr.state, filters: this.chips_arr.filters })
      }).subscribe({
        next: (results: any) => {
          if(results.count.data[0].total > 0) {
            this.resultsLength = results.count.data.total
            results.products.data.forEach((item: any) => {
              item.category_color = JSON.parse(item.category_color)
            });
            this.dataSource.data = results.products.data
            this.dataSource.paginator = this.paginator;
          } else {
            this.empty_products = true;
          }
          this.load = false;
        },
        error: () => {
          this.load = false;
        }
      });
    }
  }

  //Funciones que manejan la visulización de chips y los filtros
  add(value: any, key: string) {
    switch (key) {
      case 'search':
        this.chips.search = ((value.target as HTMLInputElement).value).trim().toLowerCase()
        this.chips_arr.search = ((value.target as HTMLInputElement).value).trim().toLowerCase()
        break;
      case 'category':
        this.chips.category = value.name
        this.chips_arr.category = value.id
        break;
      case 'is_stock':
        this.chips.is_stock = value
        this.chips_arr.is_stock = value
        break;
      case 'state':
        this.chips.state = value
        this.chips_arr.state = value
        break;
      case 'filters':
        this.chips_arr.filters = `${value.id}`;
        this.chips.filters = value.name
        break;
    }
    this.loadData()
  }
  delete(key: any) {
    delete this.chips[key];
    delete this.chips_arr[key];

    if (key !== 'filters' && this[key as keyof this]) {
        const element = this[key as keyof this];

        // Verifica si el elemento es un MatSelect
        if (element instanceof MatSelect) {
            element.value = null;
        }
        // Verifica si el elemento tiene la propiedad `nativeElement`
        else if ((element as any).nativeElement) {
            (element as any).nativeElement.value = '';
        }
    }

    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //Función que toma la fila clickeada del table eligiendo esa opción
  onRowClicked(row: any) {
    if(row) {
      this.openDialogDetail(row.id);
    }
  }

  //Redirecciona para editar el producto
  editProduct(id_product: number) {
    this._router.navigate(['init/main/product/add-product'], { queryParams: { id_product: id_product } });
  }

  //Abre el detalle del producto
  openDialogDetail(id_product: number): void {
      const dialogRef = this._dialog.open(DialogProductDetailComponent, { data: { id_product: id_product } });
  }

  //Recarga la información
  rechargeData() {
    this.loadData();
  }

}
