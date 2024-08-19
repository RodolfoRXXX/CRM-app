import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { User } from 'src/app/shared/interfaces/user.interface';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent {

  screenLarge!: boolean;
  user!: User;
  employee!: Employee;

  constructor(
    private _conector: ConectorsService,
    private _actRoute: ActivatedRoute,
    private _notify: NotificationService,
    private _router: Router
  ) {

  }

  ngOnInit(): void {
    this._conector.setUpdateTitle('Editar mi perfil');

    this.getData();

    //Carga el detector de tamaño del dispositivo
    this._conector.getScreenState().subscribe( screen => {
      this.screenLarge = screen
    })
  }

  getData() {
    // Using forkJoin to wait for both user and employee data
    forkJoin([
      this.getUser(),
      this.getEmployee()
    ]).subscribe(results => {
      // Results[0] will be user data
      // Results[1] will be employee data
      this.user = results[0];
      this.employee = results[1];
      // Call any additional data fetching methods if needed
      // this.getDataCard(this.user.id_enterprise); // Example assuming user has an id_enterprise property
    }, error => {
      this.handleNoEnterprise();
    });
  }

  //Función que busca el usuario obtenido desde el resolve de la ruta
  getUser(): Observable<User> {
    return new Observable<User>(observer => {
      this._actRoute.data.subscribe(data => {
        const resolverData = data['profile'];
        if (resolverData) {
          observer.next(resolverData);
          observer.complete();
        } else {
          observer.error('No profile data found');
        }
      }, error => {
        observer.error(error);
      });
    });
  }
  //Función que busca el empleado desde el observable
  getEmployee(): Observable<Employee> {
    return new Observable<Employee>(observer => {
      this._conector.getEmployee().subscribe(employee => {
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
  //Función que redirige el error de carga de datos
  handleNoEnterprise(): void {
    this._notify.showWarn('No ha sido posible obtener la información. Intentá nuevamente por favor.');
    setTimeout(() => {
      this._router.navigate(['init/settings/index']);
    }, 1500);
  }

}
