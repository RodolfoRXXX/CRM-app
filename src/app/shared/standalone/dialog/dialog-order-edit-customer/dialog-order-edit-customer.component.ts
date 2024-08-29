import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { catchError, map, merge, startWith, switchMap, of as observableOf} from 'rxjs';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { Customer } from 'src/app/shared/interfaces/customer.interface';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-dialog-order-edit-customer',
  templateUrl: './dialog-order-edit-customer.component.html',
  styleUrls: ['./dialog-order-edit-customer.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DialogOrderEditCustomerComponent {

  @ViewChild('input') input!: ElementRef;

  emailReg = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
  );
  dataForm!: FormGroup;
  employee!: Employee;
  customer!: Customer;
  uriImg = environment.SERVER;
  loading: boolean = false;
  optionBox:boolean = false;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name'];
  isNewCustomer: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOrderEditCustomerComponent>,
    private _api: ApiService,
    private _conector: ConectorsService,
    public _auth: AuthService,
    private _notify: NotificationService
  ) {
    this.createDataForm()
  }

  private getDataLocal(): number {
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
    });
    return this.employee.id_enterprise;
  }

  //Busca clientes existente
    getText(event: Event) {
      const data = (event.target as HTMLInputElement).value;
      if(data.length > 1) {
        this.getOptions(data);
      } else {
        this.optionBox = false;
      }
    }

    //Valor nuevo
    //Carga todas las opciones de customero
    getOptions(text: string) {
      merge()
        .pipe(
          startWith({}),
          map(() => this.getDataLocal()),
          switchMap((id_enterprise) => {
            return this._api.postTypeRequest('profile/get-customer-options', { id_enterprise: id_enterprise, text: text })
                          .pipe(catchError(async () => {observableOf(null)}));
          }),
          map((response: any) => {
            if (response && response.data) {
              return response.data;
            } else {
              return []; // Retornamos un array vacío si no hay datos o response.data no existe
            }
          })
        )
        .subscribe((value: any) => {
            // Asignamos los datos únicos al dataSource (suponiendo que dataSource es un MatTableDataSource o similar)
            this.dataSource.data = value
            this.optionBox = true;
          });
    }
    //Función que toma la fila clickeada del table eligiendo esa opción
    onRowClicked(row: any) {
      if(row) {
        this.customer = row;
        this.closeDialog({client: row, id: row.id})
      }
    }

  //Cambia de búsqueda a creación de cliente 
  newCustomer(state: boolean) {
    this.isNewCustomer = state;
    this.resetAll(state);
  }

  //Crea un cliente nuevo
    createDataForm() {
      this.dataForm = new FormGroup({
        id_enterprise: new FormControl('', [
          Validators.required
        ]),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ]),
        cuit: new FormControl('', [
          Validators.minLength(11),
          Validators.maxLength(12)
        ]),
        email: new FormControl('', [
          (control: AbstractControl):ValidationErrors|null => {
            return (!this.emailReg.test(control.value)&&(control.value.length)) ? {error_format: {value: control.value}} : null;},
          Validators.minLength(5),
          Validators.maxLength(100)
        ]),
        phone: new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(25)
        ]),
        mobile: new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(25)
        ]),
        address: new FormControl('', [
          Validators.minLength(5),
          Validators.maxLength(100)
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50)
        ]),
        state: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50)
        ]),
        country: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50)
        ]),
        status: new FormControl(1),
      })
    }

    //Mensajes de error
    getErrorName() {
      //name
      if(this.dataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un valor';
      if(this.dataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 2 caracteres';
      if(this.dataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
      return ''
    }
    getErrorEmail() {
      //email
      if(this.dataForm.controls['email'].hasError('error_format')) return 'No es un correo válido';
      if(this.dataForm.controls['email'].hasError('maxlength')) return 'Este valor debe tener menos de 100 caracteres';
      return ''
    }
    getErrorPhone() {
      //phone
      if(this.dataForm.controls['phone'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
      if(this.dataForm.controls['phone'].hasError('maxlength')) return 'Este valor debe tener menos de 25 caracteres';
      return ''
    }
    getErrorMobile() {
      //mobile
      if(this.dataForm.controls['mobile'].hasError('required')) return 'Tenés que ingresar un valor';
      if(this.dataForm.controls['mobile'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
      if(this.dataForm.controls['mobile'].hasError('maxlength')) return 'Este valor debe tener menos de 25 caracteres';
      return ''
    }
    getErrorAddress() {
      //address
      if(this.dataForm.controls['address'].hasError('minlength')) return 'Este valor debe tener más de 5 caracteres';
      if(this.dataForm.controls['address'].hasError('maxlength')) return 'Este valor debe tener menos de 100 caracteres';
      return ''
    }
    getErrorCity() {
      //city
      if(this.dataForm.controls['city'].hasError('required')) return 'Tenés que ingresar un valor';
      if(this.dataForm.controls['city'].hasError('minlength')) return 'Mínimo de 4 caracteres';
      if(this.dataForm.controls['city'].hasError('maxlength')) return 'Máximo de 50 caracteres';
      return ''
    }
    getErrorState() {
      //state
      if(this.dataForm.controls['state'].hasError('required')) return 'Tenés que ingresar un valor';
      if(this.dataForm.controls['state'].hasError('minlength')) return 'Mínimo de 4 caracteres';
      if(this.dataForm.controls['state'].hasError('maxlength')) return 'Máximo de 50 caracteres';
      return ''
    }
    getErrorCountry() {
      //country
      if(this.dataForm.controls['country'].hasError('required')) return 'Tenés que ingresar un valor';
      if(this.dataForm.controls['country'].hasError('minlength')) return 'Mínimo de 4 caracteres';
      if(this.dataForm.controls['country'].hasError('maxlength')) return 'Máximo de 50 caracteres';
      return ''
    }

    //Reseta todo a los valores iniciales
    resetAll(state: boolean) {
      if(state) {
        //oculto la caja de opciones
        this.optionBox = false;
      }
      this.dataForm.patchValue({id_enterprise: this.getDataLocal()});
    }

    onSubmit() {
      this.loading =  true;
      this._api.postTypeRequest('profile/create-customer', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.affectedRows == 1){
              //Modificó datos
              this.closeDialog({client: res.client[0], id: res.data.insertId});
              this._notify.showSuccess('Nuevo cliente creado!');
            } else{
              //Ya existe
              this._notify.showWarn('El cliente ya existe.')
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

  //Cierra la ventana de diálogo
  closeDialog(response: any): void {
    this.dialogRef.close(response);
  }

}

