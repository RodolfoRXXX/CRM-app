import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileViewComponent } from "../../view/profile-view/profile-view.component";

@Component({
  standalone: true,
  selector: 'app-dialog-view-profile',
  template: `
    <ng-container *ngIf="dataLoaded">
      <div class="p-3 pb-0">
        <app-profile-view [data]="data_user"></app-profile-view>
      </div>
    </ng-container>
  `,
  imports: [
    MaterialModule,
    CommonModule,
    ProfileViewComponent
  ]
})
export class DialogViewProfileComponent implements OnInit {

  data_user = {
    userId: 0,
    employeeId: 0,
    id_enterprise: 0
  };

  dataLoaded = false;

  constructor(
    public dialogRef: MatDialogRef<DialogViewProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    // Procesar los datos recibidos y activar la bandera de carga cuando estén listos
    if (this.data) {
      this.data_user.userId = this.data.id_user;
      this.data_user.employeeId = this.data.id_employee;
      this.data_user.id_enterprise = this.data.id_enterprise;
      this.dataLoaded = true;  // Ahora se cargará el componente hijo
    }
  }

  closeDialog(state: boolean) {
    this.dialogRef.close(state);
  }

}

