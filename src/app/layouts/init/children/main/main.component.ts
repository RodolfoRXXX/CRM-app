import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee, empty_employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  opened: boolean = false;
  mode!: any;
  title!: string;
  sector!: string;
  employee!: Employee;

  constructor(
    private _actRoute: ActivatedRoute,
    private _conector: ConectorsService,
  ) {
    this._conector.getOpenedState().subscribe( state => this.opened = state )
    this._conector.getScreenState().subscribe( state => state?this.mode = 'side':this.mode = 'over' )
  }
  ngOnInit(): void {
    //Recibe los datos del resolver y carga los datos en la vista
    this.employee = this._actRoute.snapshot.data['employee'].data[0];
    if(this.employee) {
      this._conector.setEmployee(this.employee);
    } else {
      this.employee = empty_employee;
    }

    //Actualiza el título de la vista de acuerdo al componente cargado
    this._conector.getUpdateTitle().subscribe( value => {
      (value)?this.title = value:this.title = ""
    })
    //Actualiza el sector de la vista de acuerdo al componente cargado
    this._conector.getUpdateSector().subscribe( value => {
      (value)?this.sector = value:this.sector = ""
    })
  }

}
