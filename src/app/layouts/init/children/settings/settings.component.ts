import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee, empty_employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  opened: boolean = false;
  mode!: any;
  update!: boolean;
  sector!: string;
  title!: string;
  employee!: Employee;

  constructor(
    private _conector: ConectorsService,
    private _actRoute: ActivatedRoute,
  ) {
    this._conector.getOpenedState().subscribe( state => this.opened = state );
    this._conector.getScreenState().subscribe( state => state?this.mode = 'side':this.mode = 'over' );
    this.sector = 'Configuración';
  }

  ngOnInit(): void {

    //Recibe los datos del resolver y carga los datos en la vista
    this.employee = this._actRoute.snapshot.data['employee'].data[0];
    if(this.employee) {
      this._conector.setEmployee(this.employee);
    } else {
      this.employee = empty_employee;
    }

    //Ante cambios actualiza los componentes hijos(VER SI FUNCIONA!)
    this._conector.getUpdate().subscribe( state => {
      if(this.update) {
        this.update = !this.update;
      } else {
        this.update = state;
      }
    });

    //Actualiza el título de la vista de acuerdo al componente cargado
    this._conector.getUpdateTitle().subscribe( value => {
      (value)?this.title = value:this.title = ""
    })
  }

}
