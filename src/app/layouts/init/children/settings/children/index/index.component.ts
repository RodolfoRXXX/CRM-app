import { Component } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  permissions: string[] = [];
  is_employee = false;
  edit_enterprise_control = environment.EDIT_ENTERPRISE_CONTROL;

  constructor(
    private _conector: ConectorsService
  ) { 
    this._conector.getEmployee().subscribe( value => {
      //la lista de permisos se almacena como un string y luego se lo separa en un array
      //aunque el string de la DB esté vacío, el split devuelve un array con al menos un valor,
      //que es el valor vacío, por eso la desigualdad es mayor a 1
      this.permissions = value.list_of_permissions.split(',')
      this.is_employee = (value.id > 0)?true:false;
    })
   }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Tablero')
  }

}
