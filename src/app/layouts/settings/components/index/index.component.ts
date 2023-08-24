import { Component } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Role } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html'
})
export class IndexComponent {

  roles!: Role;

  constructor(
    private _conector: ConectorsService
  ) { 
    this._conector.getRole().subscribe( value => {
      this.roles = JSON.parse(value);
    })
   }

}
