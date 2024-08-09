import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-profile-detail',
  template: '<app-profile-view [data]=data></app-profile-view>'
})
export class ProfileDetailComponent implements OnInit {

  data = {
    userId: 0,
    employeeId: 0,
    id_enterprise: 0
  }

  constructor(
    private _conector: ConectorsService,
  ) {}

ngOnInit(): void {
  this._conector.setUpdateTitle('Detalles de mi perfil');
  this.getEmployee().subscribe( result => {
    this.data.userId = result.id_user;
    this.data.employeeId = result.id;
    this.data.id_enterprise = result.id_enterprise;
  } )
}

//Obtiene la información del empleado
getEmployee(): Observable<Employee> {
  return new Observable<Employee>(observer => {
    this._conector.getEmployee().subscribe((employee: any) => {
      if (employee) {
        observer.next(employee);
        observer.complete();
      } else {
        observer.error('No employee data found');
      }
    }, error => {
      observer.error(error);
    });
  });
}

}

