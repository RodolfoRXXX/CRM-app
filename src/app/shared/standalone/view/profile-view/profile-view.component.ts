import { Component, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { environment } from 'src/enviroments/enviroment';
import { calculateDateLimit } from 'src/app/shared/functions/date.function';

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

  @Input() data!: {userId: number, employeeId: number, id_enterprise: number};

  employee!: Employee;
  user!: User;
  date_limit!: string;
  seller!: number;
  load: boolean = true;
  loading: boolean = false;
  card_values: any = { total_sale: null, pending: null, open_orders: null, relative: null };
  tabs : any = [
    {name: 'Descripción', icon: 'edit', state: 'active'}
  ]
  baseURL = environment.SERVER;

  constructor(
    private _api: ApiService,
    private _notify: NotificationService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.date_limit = calculateDateLimit(30);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.loadData();
    }
  }

  loadData(): void {
    if (this.data.userId && this.data.employeeId && this.data.id_enterprise) {
      forkJoin({
        employee: this._api.postTypeRequest('profile/get-employee-ID', { id_employee: this.data.employeeId }),
        user: this._api.postTypeRequest('profile/get-user-ID', { id_user: this.data.userId })
      }).subscribe({
        next: (results: any) => {
          this.employee = results.employee.data[0];
          this.user = results.user.data[0];
          this.getDataCard();
          this.load = false;
        },
        error: (err) => {
          console.error('Error loading data:', err);
          this.load = false; // Ensure load is set to false even if there's an error
        }
      });
    }
  }

  getDataCard(): void {
    if (this.date_limit) {
      forkJoin({
        total_sale: this._api.postTypeRequest('profile/get-user-total-sale', { id_enterprise: this.data.id_enterprise, date_limit: this.date_limit, seller: (this.employee.name_role != 'administrador')?this.data.userId:null }),
        pending: this._api.postTypeRequest('profile/get-user-pending', { id_enterprise: this.data.id_enterprise, date_limit: this.date_limit, seller: (this.employee.name_role != 'administrador')?this.data.userId:null }),
        open_orders: this._api.postTypeRequest('profile/get-user-open-orders', { id_enterprise: this.data.id_enterprise, date_limit: this.date_limit, seller: (this.employee.name_role != 'administrador')?this.data.userId:null }),
        relative: this._api.postTypeRequest('profile/get-user-relative', { id_enterprise: this.data.id_enterprise, date_limit: this.date_limit, seller: (this.employee.name_role != 'administrador')?this.data.userId:null })
      }).subscribe({
        next: (results: any) => {
          this.card_values.total_sale = results.total_sale.data[0]?.response;
          this.card_values.pending = results.pending[0]?.response;
          this.card_values.open_orders = results.open_orders.data[0]?.response;
          this.card_values.relative = (results.relative.data[0]?.open/results.relative.data[0]?.total)*100;
        }
      });
    }
  }

  editUser(): void {
    this._router.navigate(['init/settings/profile/profile-edit']);
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
  }

  activateEmployee(id_employee: number, status: number) {
    if(id_employee > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/change-employee-state', {id_employee: id_employee, status: +!status}).subscribe({
        next: (res: any) => {
          this.loading =  false;
          console.log(res)
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.affectedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess(`El empleado se ${(status == 0)?'activó':'suspendió'}!`);
              setTimeout(() => {
                this.rechargeComponent();
              }, 2000);
            } else{
              //No hubo modificación
              this._notify.showError('No se detectaron cambios. Volvé a realizar la operación.')
            }
          } else{
              //Problemas de conexión con la base de datos(res.status == 0)
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        },
        error: (error) => {
          //Error de conexión, no pudo consultar con la base de datos
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      })
    }
  }

  //Crea un nuevo empleado
  createEmployee(id_user: number, id_enterprise: number) {
    console.log(id_user, id_enterprise)
    if(id_user > 0) {
      this._api.postTypeRequest('profile/create-employee', {id_user: id_user, id_enterprise: id_enterprise}).subscribe({
        next: (res: any) => {
          console.log(res)
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.affectedRows == 1){
              //Creó un nuevo empleado
              this._notify.showSuccess('Nuevo empleado creado con éxito!');
              setTimeout(() => {
                this.rechargeComponent();
              }, 2000);
            } else{
              //Ya existe dicho empleado
              this._notify.showWarn('El empleado que intentas crear ya existe.')
            }
          } else{
            //Problemas de conexión con la base de datos(res.status == 0)
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        },
        error: (error: any) => {
          //Error de conexión, no pudo consultar con la base de datos
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      })
    }
  }

  setTab(tab: number) {
    this.tabs.forEach( (element: any, index: number) => {
      element.state = '';
      (index == tab)?element.state = 'active':'';
    });
  }
  
}


