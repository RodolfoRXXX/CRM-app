import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DialogOrderEditProductComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-product/dialog-order-edit-product.component';
import { environment } from 'src/enviroments/enviroment';

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

  constructor(
    public _auth: AuthService,
    private _getJson: GetJsonDataService,
    private _dialog: MatDialog,
    private _conector: ConectorsService
  ) {
    this._getJson.getData('order_status.json').subscribe((data: any) => {
      this.order_status = data;
    });
    this.getDataLocal().then( (employee: Employee) => {
      this.employee = employee;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'] && changes['data'].currentValue.detail !== undefined) {
      this.load = true;
      this.getProducts();
    }
    if(changes['data'] && changes['data'].currentValue.edit) {
      this.editRegister = this.data.edit
    }
  }

  //trae el id_enterprise para el formulario
  async getDataLocal(): Promise<Employee> {
    try {
      const data = await firstValueFrom(this._conector.getEmployee());
      return data;
    } catch (error) {
      throw error;
    }
  }

  //función que extrae los productos de una orden existente
  private getProducts(): void {
    if(this.data.detail) {
      const data = JSON.parse(this.data.detail);
      if(data) {
        this.dataSource.data = data;
      }
    }
    this.load = false;
  }

  // Método para encontrar el estado correspondiente
  getStatus(statusId: number) {
    return this.order_status.find(value => value.id === statusId);
  }

  //Abro la ventana de diálogo para agregar lineas o modificarlas
  addProduct(id_product: number = 0, qty_db: number = 0) {
    const dialogRef = this._dialog.open(DialogOrderEditProductComponent, { data: {id_product: id_product, qty_db: qty_db, edit: this.editRegister} });
    dialogRef.afterClosed().subscribe(response => {
      if(response) {
        const findItem = this.dataSource.data.findIndex( (element: any) => element.id_product == response.item.id_product );
        if(findItem > -1) {
          //existe el producto en el remito
            //agregar, sumar cantidad o eliminar al producto del remito
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
          //no existe
            //agrega un nuevo producto al remito
            this.dataSource.data.push(response.item);
        }
        this.ngAfterViewInit();
        this.setDetail.emit({detail: this.dataSource.data, edit: response.edit});
      }
    });
  }

  //Actualizo el array con los datos
  ngAfterViewInit() {
    this.dataSource.data = this.dataSource.data
  }

}
