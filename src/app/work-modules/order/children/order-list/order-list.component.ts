import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Category } from 'src/app/shared/interfaces/category.interface';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DialogProductDetailComponent } from 'src/app/shared/standalone/dialog/dialog-product-detail/dialog-product-detail.component';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit {

  employee!: Employee;
  categories!: Category[];
  displayedColumns: string[] = ['detail', 'product', 'category', 'stock_real', 'state_stock', 'sale_price', 'sku', 'state'];
  dataSource = new MatTableDataSource();
  resultsLength!: number;
  load_card1 = false;
  load_card2 = false;
  load_card3 = false;
  load_card4 = false;
  load = true;
  recharge = false;
  empty_products = false;
  chips: any = { category: '', stock: '', state: '', search: '' };
  card_values: any = { products_with_stock: null, value_stock: null, products_without_stock: null, immo_stock: null };
  permissions: string[] = [];
  add_product_admin = '6';
  uriImg = environment.SERVER;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ApiService,
    private conector: ConectorsService,
    private paginatorIntl: MatPaginatorIntl,
    private dialog: MatDialog
  ) {
    this.initPaginatorLabels();
    this.getProducts();
  }

  ngOnInit(): void {
    this.conector.setUpdateTitle('Lista de pedidos');
  }

  private initPaginatorLabels(): void {
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
    this.paginatorIntl.firstPageLabel = "Primera página";
    this.paginatorIntl.lastPageLabel = "Última página";
    this.paginatorIntl.nextPageLabel = "Próxima página";
    this.paginatorIntl.previousPageLabel = "Anterior página";
  }

  private getDataLocal(): number {
    this.conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
      this.permissions = item.list_of_permissions.split(',');
    });
    return this.employee.id_enterprise;
  }

  private getProducts(): void {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap(id_enterprise => {
          this.getDataCard(id_enterprise);
          this.getCategories(id_enterprise);
          return this.api.postTypeRequest('profile/get-count-products', { id_enterprise })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => this.resultsLength = data.data[0].total);
  }

  private getCategories(id_enterprise: number): void {
    this.api.postTypeRequest('profile/get-categories', { id_enterprise }).subscribe((value: any) => {
      this.categories = value.data;
    });
  }

  private getDataCard(id_enterprise: number): void {
    const date_limit = this.calculateDateLimit(60);
    this.api.postTypeRequest('profile/get-products-data', { id_enterprise, date_limit }).subscribe((value: any) => {
      this.card_values.products_with_stock = value.data[0]?.data || 0;
      this.card_values.value_stock = value.data[1]?.data || 0;
      this.card_values.products_without_stock = value.data[2]?.data || 0;
      this.card_values.immo_stock = value.data[3]?.data || 0;
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
          return this.api.postTypeRequest('profile/get-products', { id_enterprise, page: this.paginator.pageIndex, size: 10 })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        this.load = false;
        if (data.data) {
          data.data.forEach((item: any) => item.category_color = JSON.parse(item.category_color));
          this.dataSource.data = data.data;
        } else {
          this.empty_products = true;
        }
      });

    this.dataSource.sort = this.sort;
  }

  openDialogDetail(id_enterprise: number, name: string, id_option_1: number, id_option_2: number): void {
    this.dialog.open(DialogProductDetailComponent, {
      data: { id_enterprise, name, id_option_1, id_option_2 }
    });
  }

  rechargeData(): void {
    this.ngAfterViewInit();
  }
}

