import { Component } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Role } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html'
})
export class IndexComponent {

  roles!: Role;
  is_employee!: boolean;

  constructor(
    private _conector: ConectorsService
  ) { 
    this._conector.getEmployee().subscribe( value => {
      this.roles = JSON.parse(value.role);
      this.is_employee = (value.id != 0)?true:false;
    })
   }

}
