import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';

@Component({
  selector: 'app-enterprise-edit-info',
  templateUrl: './enterprise-edit-info.component.html',
  styleUrls: ['./enterprise-edit-info.component.scss']
})
export class EnterpriseEditInfoComponent {

  @Input() enterprise!: Enterprise;

  emailReg = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
  );
  dataForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private _api: ApiService,
    private _notify: NotificationService,
    private _auth: AuthService
  ) {
    this.createDataForm();
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['enterprise']) {
      this.setDataForm(changes['enterprise'].currentValue)
    }
  }

  //Función que crea el formulario para editar los datos básicos del empleado
  createDataForm(): void {
    this.dataForm = new FormGroup({
      id: new FormControl(''),
      name : new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ]),
      cuit : new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(30)
      ]),
      address : new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(30)
      ]),
      cp : new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(30)
      ]),
      phone_1 : new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(15)
      ]),
      phone_2 : new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(15)
      ]),
      city : new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15)
      ]),
      state : new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15)
      ]),
      country : new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15)
      ]),
  });
  }

  //Setea los valores del formulario si tuviera que cargarse un empleado
  setDataForm(enterprise: Enterprise) {
    this.dataForm.setValue({
      id: (enterprise.id > 0)?enterprise.id:'',
      name: (enterprise.name != '')?enterprise.name:'',
      cuit: (enterprise.cuit != '')?enterprise.cuit:'',
      address: (enterprise.address != '')?enterprise.address:'',
      cp: (enterprise.cp != '')?enterprise.cp:'',
      phone_1: (enterprise.phone_1 > 0)?enterprise.phone_1:'',
      phone_2: (enterprise.phone_2 > 0)?enterprise.phone_2:'',
      city: (enterprise.city != '')?enterprise.city:'',
      state: (enterprise.state != '')?enterprise.state:'',
      country: (enterprise.country != '')?enterprise.country:'',
    })
  }

  //Mensajes de error
  getErrorName() {
    //name
    if(this.dataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';
    return ''
  }
  getErrorCuit(){
    //cuit
    if(this.dataForm.controls['cuit'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['cuit'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';
    return ''
  }
  getErrorAddress() {
    //address
    if(this.dataForm.controls['address'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['address'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';
    return ''
  }
  getErrorCp() {
    //código postal
    if(this.dataForm.controls['cp'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['cp'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';
    return ''
  }
  getErrorPhone1() {
    //phone
    if(this.dataForm.controls['phone_1'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['phone_1'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';
    return ''
  }
  getErrorPhone2() {
    //phone2
    if(this.dataForm.controls['phone_2'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['phone_2'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';
    return ''
  }
  getErrorCity() {
    //city
    if(this.dataForm.controls['city'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['city'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['city'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';
    return ''
  }
  getErrorState() {
    //state
    if(this.dataForm.controls['state'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['state'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['state'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';
    return ''
  }
  getErrorCountry() {
    //country
    if(this.dataForm.controls['country'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['country'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['country'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';
    return ''
  }

  //Elimina todo lo que el reset básico no limpia
  resetAll() {
    if(this.enterprise) {
      this.setDataForm(this.enterprise)
    } else {
      this.dataForm.reset()
      this.dataForm.patchValue({id: this.enterprise['id']})
    }
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
  }

  onSubmit() {
    this.loading =  true;
    this._api.postTypeRequest('profile/update-enterprise', this.dataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó datos empresa
            this._notify.showSuccess('Información actualizada con éxito!');
            //Modificar el localstorage
            let data = JSON.parse(this._auth.getDataFromLocalStorage())
            data.enterprise = res.name
            this._auth.setUserData(data)
            setTimeout(() => {
              this.rechargeComponent();
            }, 2000);
          } else{
            //No hubo modificación
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
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
