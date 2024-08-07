import { Component, Input, SimpleChanges, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { forkJoin, map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { environment } from 'src/enviroments/enviroment';

@Component({
  standalone: true,
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  imports: [
    MaterialModule,
    CommonModule
  ]
})
export class ProfileViewComponent implements OnInit, OnChanges {

  @Input() data!: {userId: number, employeeId: number};

  employee!: Employee;
  user!: User;
  load: boolean = true;
  card_values: any = { total_employees: null, total_stock: null, notpaid_orders: null, total_sales: null };
  baseURL = environment.SERVER;

  constructor(
    private _api: ApiService,
    private _notify: NotificationService,
    private _router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.getInfo();
    }
  }

  getInfo() {

    forkJoin({
      user: this.getUser(),
      employee: this.getEmployee()
    }).subscribe({
      next: (results) => {
        this.user = results.user;
        this.employee = results.employee;
        this.load = false;
        console.log(this.user, this.employee);
        this.cdr.detectChanges();
        // Call any additional data fetching methods if needed
        // this.getDataCard(this.user.id_enterprise); // Example assuming user has an id_enterprise property
      },
      error: (error) => {
        this.handleNoEnterprise();
      }
    });
  }

  getEmployee(): Observable<Employee> {
    return this._api.postTypeRequest('profile/get-employee-ID', { id_employee: this.data.employeeId }).pipe(
      map((response: any) => {
        if (response.data) {
          return response.data;
        } else {
          throw new Error('No employee data found');
        }
      })
    );
  }

  getUser(): Observable<User> {
    return this._api.postTypeRequest('profile/get-user-ID', { id_user: this.data.userId }).pipe(
      map((response: any) => {
        if (response.data) {
          return response.data;
        } else {
          throw new Error('No user data found');
        }
      })
    );
  }

  handleNoEnterprise(): void {
    this._notify.showWarn('No ha sido posible obtener la información. Intentá nuevamente por favor.');
    setTimeout(() => {
      this._router.navigate(['init/settings/index']);
    }, 1500);
  }

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

