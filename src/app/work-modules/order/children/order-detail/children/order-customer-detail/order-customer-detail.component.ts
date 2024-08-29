import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Customer } from 'src/app/shared/interfaces/customer.interface';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DialogOrderEditCustomerComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-customer/dialog-order-edit-customer.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-customer-detail',
  templateUrl: './order-customer-detail.component.html',
  styleUrls: ['./order-customer-detail.component.scss']
})
export class OrderCustomerDetailComponent {

  @Input() customer!: number;
  @Input() info!: any;
  @Output() setCustomer = new EventEmitter<number>();

  load: boolean = false;
  newCustomer!: Customer;
  uriImg = environment.SERVER;
  employee!: Employee;
  edit_enterprise_control = environment.EDIT_ENTERPRISE_CONTROL;

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog,
    private _conector: ConectorsService
  ) {
    this.getDataLocal().then( (employee: Employee) => {
      this.employee = employee;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer'].currentValue !== undefined) {
      this.load = true;
      this.getCustomer(changes['customer'].currentValue);
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

  getCustomer(customer: number) {
    this._api.postTypeRequest('profile/get-customer-id', { id_customer: customer }).subscribe( (value:any) => {
      if(value) {
        this.load = false;
        this.newCustomer = value.data[0];
      }
    })
  }

  editCustomer(customer: number = 0) {
    const dialogRef = this._dialog.open(DialogOrderEditCustomerComponent, { data: { id_customer: customer }});
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.newCustomer = result.client;
          this.setCustomer.emit(result.id);
        }
      });
  }

}
