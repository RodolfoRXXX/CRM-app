import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DialogOrderEditObservationComponent } from 'src/app/shared/standalone/dialog/dialog-order-edit-observation/dialog-order-edit-observation.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-observation',
  templateUrl: './order-observation.component.html',
  styleUrls: ['./order-observation.component.scss']
})
export class OrderObservationComponent {

  @Input() observation!: string;
  @Input() info!: any;
  @Output() setObservation = new EventEmitter<string>();
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

  //trae el id_enterprise para el formulario
  async getDataLocal(): Promise<Employee> {
    try {
      const data = await firstValueFrom(this._conector.getEmployee());
      return data;
    } catch (error) {
      throw error;
    }
  }

  editObservation(observation: string) {
    const dialogRef = this._dialog.open(DialogOrderEditObservationComponent, { data: { observation: observation }});
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.observation = result;
          this.setObservation.emit(result);
        }
      });
  }

}
