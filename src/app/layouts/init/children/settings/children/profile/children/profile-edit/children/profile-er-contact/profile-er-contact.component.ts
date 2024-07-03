import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-profile-er-contact',
  templateUrl: './profile-er-contact.component.html',
  styleUrls: ['./profile-er-contact.component.scss']
})
export class ProfileErContactComponent {

  @Input() employee!: Employee;
  dataForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
    private _notify: NotificationService
  ) {
    this.createDataForm();
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee']) {
      this.setDataForm(changes['employee'].currentValue)
    }
  }

  //Función que crea el formulario para editar la información de contacto de emergencia
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl('', [
          Validators.required
        ]),
        name_er : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        phone_er : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(20)
        ])
    });
  }

  //Setea los valores del formulario si tuviera que cargarse un empleado
  setDataForm(employee: Employee) {
    this.dataForm.setValue({
      id: (employee.id > 0)?employee.id:'',
      name_er: (employee.name_er != '')?employee.name_er:'',
      phone_er: (employee.phone_er != '')?employee.phone_er:''
    })
  }

  getErrorNameEr() {
    //name-er
    if(this.dataForm.controls['name_er'].hasError('minlength')) return 'Mínimo de 4 caracteres';
    if(this.dataForm.controls['name_er'].hasError('maxlength')) return 'Máximo de 30 caracteres';
    return ''
  }
  getErrorPhoneEr() {
    //phone-er
    if(this.dataForm.controls['phone_er'].hasError('minlength')) return 'Mínimo de 4 caracteres';
    if(this.dataForm.controls['phone_er'].hasError('maxlength')) return 'Máximo de 15 caracteres';
    return ''
  }

  //Reseta todo a los valores iniciales
  resetAll() {
    this.setDataForm(this.employee)
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
  }

  onSubmit() {
    this.loading = true;
    this._api.postTypeRequest('profile/update-employee-er-contact', this.dataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó la info
            this._notify.showSuccess('Información actualizada con éxito!');
            this._conector.setEmployee(res.data[0]);
            this.rechargeComponent();
          } else{
            //No hubo modificación
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes.');
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })
  }

}
