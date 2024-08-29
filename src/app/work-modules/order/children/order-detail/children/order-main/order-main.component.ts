import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DialogOrderEditProductComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-product/dialog-order-edit-product.component';
import { DialogProductDetailComponent } from 'src/app/shared/standalone/dialog/dialog-product-detail/dialog-product-detail.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-main',
  templateUrl: './order-main.component.html',
  styleUrls: ['./order-main.component.scss']
})
export class OrderMainComponent {

  @Input() data!: any;
  @Input() info!: any;
  @Output() setDetail = new EventEmitter<any>();

  dataSource: any = new MatTableDataSource();
  displayedColumns: string[] = ['sku', 'product', 'qty', 'status', 'edit'];
  load: boolean = false;
  uriImg = environment.SERVER;
  order_status!: any[];
  editRegister = [];
  employee!: Employee;
  edit_enterprise_control = environment.EDIT_ENTERPRISE_CONTROL;

  constructor(
    public _auth: AuthService,
    private _getJson: GetJsonDataService,
    private _dialog: MatDialog,
    private _conector: ConectorsService
  ) {
    this.initializeData();
  }

  async initializeData() {
    try {
      // Cargar la data necesaria antes de llamar a getProducts()
      await this.loadOrderStatus();
      this.employee = await this.getDataLocal();

      // Llamar a getProducts() si ya se cargó la data
      if (this.data?.detail) {
        this.load = true;
        this.getProducts();
      }
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  async loadOrderStatus() {
    try {
      this.order_status = await firstValueFrom(this._getJson.getData('order_status.json'));
    } catch (error) {
      console.error('Error loading order status:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue?.detail !== undefined) {
      this.load = true;
      if (this.order_status) { // Asegurarse de que order_status esté cargado
        this.getProducts();
      }
    }
    if (changes['data'] && changes['data'].currentValue?.edit) {
      this.editRegister = this.data.edit;
    }
  }

  async getDataLocal(): Promise<Employee> {
    try {
      return await firstValueFrom(this._conector.getEmployee());
    } catch (error) {
      throw error;
    }
  }

  private getProducts(): void {
    if (this.data.detail) {
      const data = JSON.parse(this.data.detail);
      if (data) {
        this.dataSource.data = data;
      }
    } else {
      this.dataSource.data = []
    }
    this.load = false;
  }

  onRowClicked(row: any) {
    if (row) {
      this.openDialogDetail(row.id_product);
    }
  }

  openDialogDetail(id_product: number): void {
    this._dialog.open(DialogProductDetailComponent, { data: { id_product: id_product } });
  }

  getStatus(statusId: number) {
    return this.order_status?.find(value => value.id === statusId);
  }

  addProduct(e: Event, id_product: number = 0, qty_db: number = 0) {
    e.stopPropagation();
    const dialogRef = this._dialog.open(DialogOrderEditProductComponent, { data: { id_product: id_product, qty_db: qty_db, edit: this.editRegister } });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const findItem = this.dataSource.data.findIndex((element: any) => element.id_product == response.item.id_product);
        if (findItem > -1) {
          switch (response.state) {
            case 'new':
              this.dataSource.data[findItem].qty += response.item.qty;
              break;
            case 'edit':
              this.dataSource.data[findItem].qty = response.item.qty;
              break;
            case 'delete':
              this.dataSource.data.splice(findItem, 1);
              break;
          }
        } else {
          this.dataSource.data.push(response.item);
        }
        this.ngAfterViewInit();
        this.setDetail.emit({ detail: this.dataSource.data, edit: response.edit });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.data = this.dataSource.data;
  }
}

