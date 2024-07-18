import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { Customer } from 'src/app/shared/interfaces/customer.interface';
import { DialogOrderEditCustomerComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-customer/dialog-order-edit-customer.component';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-order-customer-detail',
  templateUrl: './order-customer-detail.component.html',
  styleUrls: ['./order-customer-detail.component.scss']
})
export class OrderCustomerDetailComponent {

  @Input() order!: any;
  @Output() setCustomer = new EventEmitter<number>();

  load: boolean = false;
  loading: boolean = false;
  recharge: boolean = false;
  customer!: Customer;
  uriImg = environment.SERVER;

  constructor(
    private _api: ApiService,
    private _dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order'].currentValue !== undefined) {
      this.load = true;
      this.getCustomer(changes['order'].currentValue.customer);
    }
  }

  getCustomer(id_customer: number) {
    this._api.postTypeRequest('profile/get-customer-id', { id_customer: id_customer }).subscribe( (value:any) => {
      if(value) {
        this.load = false;
        this.customer = value.data[0];
      }
    })
  }

  rechargeData() {
    this.getCustomer(this.order.customer);
  }

  editCustomer(id_customer: number = 0) {
    const dialogRef = this._dialog.open(DialogOrderEditCustomerComponent, { data: { id_customer: id_customer }});
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.customer = result;
          this.setCustomer.emit(result.id);
        }
      });
  }

}
