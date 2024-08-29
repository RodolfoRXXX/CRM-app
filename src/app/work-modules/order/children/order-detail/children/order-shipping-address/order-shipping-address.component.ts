import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DialogOrderEditShipmentComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-shipment/dialog-order-edit-shipment.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-shipping-address',
  templateUrl: './order-shipping-address.component.html',
  styleUrls: ['./order-shipping-address.component.scss']
})
export class OrderShippingAddressComponent {

  @Input() shipment!: string;
  @Input() info!: any;
  @Output() setShipment = new EventEmitter<string>();

  dataShipment!: any;
  employee!: Employee;
  edit_enterprise_control = environment.EDIT_ENTERPRISE_CONTROL;

  constructor(
    private _dialog: MatDialog,
    private _conector: ConectorsService
  ) {
    this.getDataLocal().then( (employee: Employee) => {
      this.employee = employee;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shipment'] && changes['shipment'].currentValue) {
      this.dataShipment = JSON.parse(this.shipment);
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

  editShipment() {
    const dialogRef = this._dialog.open(DialogOrderEditShipmentComponent, { data: { shipment: this.dataShipment }});
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.dataShipment = result
          this.setShipment.emit(JSON.stringify(result));
        }
      });
  }

}
