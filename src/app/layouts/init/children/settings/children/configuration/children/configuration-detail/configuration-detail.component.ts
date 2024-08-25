import { Component } from '@angular/core';
import { merge, startWith, map, switchMap, range, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';

@Component({
  selector: 'app-configuration-detail',
  templateUrl: './configuration-detail.component.html'
})
export class ConfigurationDetailComponent {

  enterprise!: Enterprise;
  employee!: Employee;

  constructor(
    private _conector: ConectorsService,
    private _api: ApiService
  ) { 
   }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Detalle de mi plan')
    this.getEnterprise()
  }

  private getDataLocal(): number {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
    });
    return this.employee.id_enterprise;
  }

  getEnterprise() {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap(id_enterprise => {
          return this._api.postTypeRequest('profile/get-enterprise', { id: id_enterprise })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        if((data.status == 1) && data.data[0]) {
          this.enterprise = data.data[0]
        }
      } );
  }

}
