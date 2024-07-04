import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {

  user!: User;
  employee!: Employee;
  load: boolean = true;
  card_values: any = { total_employees: null, total_stock: null, notpaid_orders: null, total_sales: null };
  baseURL = environment.SERVER;

  constructor(
    private _api: ApiService,
    private _actRoute: ActivatedRoute,
    private _notify: NotificationService,
    private _conector: ConectorsService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._conector.setUpdateTitle('Detalles de mi perfil');

    // Using forkJoin to wait for both user and employee data
    forkJoin([
      this.getUser(),
      this.getEmployee()
    ]).subscribe(results => {
      // Results[0] will be user data
      // Results[1] will be employee data
      this.user = results[0];
      this.employee = results[1];
      this.load = false;
      // Call any additional data fetching methods if needed
      // this.getDataCard(this.user.id_enterprise); // Example assuming user has an id_enterprise property
    }, error => {
      this.handleNoEnterprise();
    });
  }

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

  handleNoEnterprise(): void {
    this._notify.showWarn('No ha sido posible obtener la información. Intentá nuevamente por favor.');
    setTimeout(() => {
      this._router.navigate(['init/settings/index']);
    }, 1500);
  }

  // Example method to fetch additional data
  getDataCard(id_enterprise: number): void {
    this._api.postTypeRequest('profile/get-enterprise-data', { id_enterprise }).subscribe(
      (value: any) => {
        this.card_values = {
          total_employees: value.data[0].data || 0,
          total_stock: value.data[1].data || 0,
          notpaid_orders: value.data[2].data || 0,
          total_sales: value.data[3].data || 0,
        };
      },
      error => {
        console.error(error);
      }
    );
  }

  editUser(): void {
    this._router.navigate(['init/settings/profile/profile-edit']);
  }

}

