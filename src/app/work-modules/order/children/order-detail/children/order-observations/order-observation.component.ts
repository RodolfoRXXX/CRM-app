import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogOrderEditObservationComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-observation/dialog-order-edit-observation.component';

@Component({
  selector: 'app-order-observation',
  templateUrl: './order-observation.component.html',
  styleUrls: ['./order-observation.component.scss']
})
export class OrderObservationComponent {

  @Input() observation!: string;
  @Output() setObservation = new EventEmitter<string>();

  constructor(
    private _dialog: MatDialog
  ) {}

  editObservation(observation: string) {
    const dialogRef = this._dialog.open(DialogOrderEditObservationComponent, { data: { observation: observation }});
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.setObservation.emit(result);
        }
      });
  }

}
