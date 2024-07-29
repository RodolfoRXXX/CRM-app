import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogOrderEditShipmentComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-shipment/dialog-order-edit-shipment.component';

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

  constructor(
    private _dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shipment'] && changes['shipment'].currentValue) {
      this.dataShipment = JSON.parse(this.shipment);
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
