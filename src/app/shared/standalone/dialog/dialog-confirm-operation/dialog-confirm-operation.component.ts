import { Component, Inject} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  standalone: true,
  selector: 'app-dialog-confirm-operation',
  templateUrl: './dialog-confirm-operation.component.html',
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class DialogConfirmOperationComponent {

  text!: string;
  icon_name!: string;
  icon_color!: string;

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmOperationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.text = data.text
    this.icon_name = data.icon_name
    this.icon_color = data.icon_color
  }

  closeDialog(state: boolean) {
    this.dialogRef.close(state);
  }

}
