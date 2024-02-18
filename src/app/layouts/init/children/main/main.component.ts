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
    this.employee = this._actRoute.snapshot.data['employee'].data[0];
    console.log(this.employee)
    if(this.employee) {
      this._conector.setEmployee(this.employee);
    } else {
      this.employee = empty_employee;
    }
  }

}
