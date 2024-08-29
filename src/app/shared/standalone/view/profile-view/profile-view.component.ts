import { Component, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { User } from 'src/app/shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { calculateDateLimit } from 'src/app/shared/functions/date.function';
import { ConectorsService } from 'src/app/services/conectors.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ProfileViewComponent implements OnInit, OnChanges {

  @Input() data!: {userId: number, employeeId: number, id_enterprise: number};

  dataForm!: FormGroup;

  employee!: Employee;
  roles!: any;
  user!: User;
  watcher!: Employee;
  permissions: string[] = [];
  edit_employee_control = environment.EDIT_EMPLOYEE_CONTROL;
  edit_enterprise_control = environment.EDIT_ENTERPRISE_CONTROL;
  date_limit!: string;
  seller!: number;
  load: boolean = true;
  loading: boolean = false;
  card_values: any = { total_sale: null, pending: null, open_orders: null, relative: null };
  tabs : any = [
    {name: 'Descripción', icon: 'edit', state: 'active'},
    {name: 'Configuración', icon: 'settings', state: ''}
  ]
  baseURL = environment.SERVER;

  constructor(
    private _api: ApiService,
    private _notify: NotificationService,
    private _router: Router,
    private _conector: ConectorsService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.date_limit = calculateDateLimit(30);
    this.getDataLocal();
    this.getRoles();
    this._conector.getEmployee().subscribe( value => {
      //la lista de permisos se almacena como un string y luego se lo separa en un array
      //aunque el string de la DB esté vacío, el split devuelve un array con al menos un valor,
      //que es el valor vacío, por eso la desigualdad es mayor a 1
      this.permissions = value.list_of_permissions.split(',')
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.loadData();
    }
  }

  private getDataLocal(): void {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.watcher = item;
    });
  }

  loadData(): void {
    if (this.data.userId && this.data.id_enterprise) {
      forkJoin({
        employee: this._api.postTypeRequest('profile/get-employee-ID', { id_employee: this.data.employeeId }),
        user: this._api.postTypeRequest('profile/get-user-ID', { id_user: this.data.userId })
      }).subscribe({
        next: (results: any) => {
          this.employee = (results.employee.status == 1)?results.employee.data[0]:undefined;
          this.user = results.user.data[0];
          (this.employee)?this.getDataCard():'';
          this.load = false;
        },
        error: () => {
          this.load = false; // Ensure load is set to false even if there's an error
        }
      });
    }
  }

  getDataCard(): void {
    if (this.date_limit) {
      forkJoin({
        total_sale: this._api.postTypeRequest('profile/get-data-total-sale', { id_enterprise: this.data.id_enterprise, date_limit: this.date_limit, seller: (this.permissions.includes(this.edit_enterprise_control))?this.data.userId:null }),
        pending: this._api.postTypeRequest('profile/get-user-pending', { id_enterprise: this.data.id_enterprise, date_limit: this.date_limit, seller: (this.permissions.includes(this.edit_enterprise_control))?this.data.userId:null }),
        open_orders: this._api.postTypeRequest('profile/get-user-open-orders', { id_enterprise: this.data.id_enterprise, date_limit: this.date_limit, seller: (this.permissions.includes(this.edit_enterprise_control))?this.data.userId:null }),
        relative: this._api.postTypeRequest('profile/get-user-relative', { id_enterprise: this.data.id_enterprise, date_limit: this.date_limit, seller: (this.permissions.includes(this.edit_enterprise_control))?this.data.userId:null })
      }).subscribe({
        next: (results: any) => {
          this.card_values.total_sale = results.total_sale.data[0]?.response;
          this.card_values.pending = results.pending.data[0]?.response;
          this.card_values.open_orders = results.open_orders.data[0]?.response;
          this.card_values.relative = (1 - (results.relative.data[0]?.open/results.relative.data[0]?.total))*100;
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

  getRoles(): void {
    this._api.postTypeRequest('profile/get-roles', { id_enterprise: this.data.id_enterprise }).subscribe( (value:any) => {
      this.roles = value.data
    })
  }

  createForm() {
    this.dataForm = new FormGroup({
      id: new FormControl(this.data.userId, [
        Validators.required
      ]),
      id_enterprise: new FormControl(this.data.id_enterprise, [
        Validators.required
      ]),
      role: new FormControl('', [
        Validators.required
      ])
    })
  }

  //Capturador de errores del valor de formulario
  getErrorRole() {
    //role
    if(this.dataForm.controls['role'].hasError('required')) return 'Elegí una opción';
      return ''
  }

  //Crea un nuevo empleado
  createEmployee() {
    if(this.dataForm.valid) {
      this._api.postTypeRequest('profile/create-employee', this.dataForm.value).subscribe({
        next: (res: any) => {
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

  //Cambiar de rol
  changeRole() {
    if(this.dataForm.valid) {
      this._api.postTypeRequest('profile/update-user-role', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.affectedRows == 1){
              //Creó un nuevo empleado
              this._notify.showSuccess('Rol modificado con éxito!');
              setTimeout(() => {
                this.rechargeComponent();
              }, 2000);
            } else{
              //Ya existe dicho empleado
              this._notify.showWarn('No se realizaron cambios.')
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
