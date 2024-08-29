import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, AfterViewInit {

  employee!: Employee;
  permissions: string[] = [];
  load = false;
  recharge = false;
  displayedColumns: string[] = ['id', 'category', 'stock', 'price', 'edit'];
  dataSource = new MatTableDataSource();
  empty_categories: boolean = false;
  add_product_admin = environment.EDIT_PRODUCT_CONTROL;

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._conector.setUpdateTitle('Lista de categorías');
    this.getDataLocal();
  }

  getDataLocal(): void {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
      this.permissions = item.list_of_permissions.split(',');
    });
  }

  ngAfterViewInit() {
    this.loadCategories();
  }

  loadCategories() {
    merge()  // Listen for sort changes
      .pipe(
        startWith({}),
        switchMap(() => {
          this.recharge = false;
          this.load = true;
          return this._api.postTypeRequest('profile/get-categories-stock-price', { id_enterprise: this.employee.id_enterprise })
            .pipe(catchError(err => {
              console.error(err);
              this.recharge = true;
              this.load = false;
              return observableOf(null);
            }));
        }),
        map(data => {
          this.load = false;
          
          return data;
        })
      )
      .subscribe((data: any) => {
        if (data.data) {
          data.data.forEach((item: any) => {
            item.color_badge = JSON.parse(item.color_badge)
          });
          this.dataSource.data = data.data;
        } else {
          this.empty_categories = true;
        }
      });
  }

  rechargeData() {
    this.loadCategories();
  }

  editCategory(id_category: number) {
    this._router.navigate(['init/main/product/add-category'], { queryParams: { id_category: id_category } });
  }
}

