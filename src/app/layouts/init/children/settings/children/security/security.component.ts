import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DialogComponent } from 'src/app/shared/standalone/dialog/dialog-password/dialog.component';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

  usernameDataForm!: FormGroup;
  setPasswordDataForm!: FormGroup;
  passwordFirst!: FormControl;
  setEmailDataForm!: FormGroup;
  emailFirst!: FormControl;
  formMsg!: FormGroup;
  id_user!: number;

  act_name!: string;

  hide_1: boolean = true;
  hide_2: boolean = true;
  emailReg = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
  );

  loading_username: boolean = false;
  loading_set_password: boolean = false;
  loading_set_email: boolean = false;
  
  disable_username: boolean = false;
  disable_set_password: boolean = false;
  disable_set_email: boolean = false;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _notify: NotificationService,
    private _conector: ConectorsService,
    private _router: Router,
    public _dialog: MatDialog
  ) {
    this.passwordFirst = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10)
    ]);
    this.emailFirst = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(35),
      (control: AbstractControl):ValidationErrors|null => {
      return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
    ]);

    this.createUsernameForm();
    this.createSetPasswordForm();
    this.createSetEmailForm();
    this.createFormMsg();
    this.getDataUser();
    this.openDialog();
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Seguridad')

    this.passwordFirst.valueChanges.subscribe( value => {
      if( ((this.setPasswordDataForm.value.password?.length > 3) && (this.setPasswordDataForm.value.password?.length < 11) ) && (value !== this.setPasswordDataForm.value.password)) {
        this.setPasswordDataForm.controls['password'].setErrors({ no_equal: true });
      }
    })
    this.setPasswordDataForm.controls['password'].valueChanges.subscribe( value => {
      if(value !== this.passwordFirst.value) {
        this.setPasswordDataForm.controls['password'].setErrors({ no_equal: true });
      }
    })
    this.emailFirst.valueChanges.subscribe( value => {
      if(value !== this.setEmailDataForm.value.email) {
        this.setEmailDataForm.controls['email'].setErrors({ no_equal: true });
      }
    })
    this.setEmailDataForm.controls['email'].valueChanges.subscribe( value => {
      if(value !== this.emailFirst.value) {
        this.setEmailDataForm.controls['email'].setErrors({ no_equal: true });
      }
    })
  }

  openDialog(): void {
    this._dialog.open(DialogComponent, { disableClose: true });
  }

  getDataUser() {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    //Setea los valores de la caard de nombre de usuario
      if((data.name)&&(data.name.length)) {
        this.usernameDataForm.controls['name'].setValue(data.name);
        this.act_name = data.name
      } else {
        this.usernameDataForm.controls['name'].setValue(data.email.split("@")[0]);
        this.act_name = data.email.split("@")[0]
      }
      this.usernameDataForm.patchValue({
        id: data.id
      })
      this.formMsg.patchValue({
        email: data.email
      })
      //Setea los valores de la card de cambio de contraseña
      this.setPasswordDataForm.patchValue({
        id: data.id
      })
      this.setEmailDataForm.patchValue({
        id: data.id
      })
      this.formMsg.patchValue({
        email: data.email
      })
      this.id_user = data.id;
  }

  hide1Password(ev: any): void {
    ev.preventDefault();
    this.hide_1 = !this.hide_1;
  }
  hide2Password(ev: any): void {
    ev.preventDefault();
    this.hide_2 = !this.hide_2;
  }

  createUsernameForm(): void {
    this.usernameDataForm = new FormGroup({
        id: new FormControl('', [
          Validators.required
        ]),
        name : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(25)
        ])
    });
  }

  createSetPasswordForm(): void {
    this.setPasswordDataForm = new FormGroup({
        id: new FormControl('', [
          Validators.required
        ]),
        password : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ]),
    });
  }

  createSetEmailForm(): void {
    this.setEmailDataForm = new FormGroup({
        id: new FormControl('', [
          Validators.required
        ]),
        email : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(35),
          (control: AbstractControl):ValidationErrors|null => {
          return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ]),
        activation_code: new FormControl(''),
        state: new FormControl(0)
    });
  }

  createFormMsg() {
    this.formMsg = new FormGroup({
      email: new FormControl(''),
      data: new FormControl(''),
      tipo: new FormControl('')
    });
  }

  //Botones de reset
  resetUsername() {
    this.usernameDataForm.patchValue({name: this.act_name})
  }
  resetPassword() {
    this.setPasswordDataForm.patchValue({id: this.id_user})
  }
  resetEmail() {
    this.setEmailDataForm.patchValue({id: this.id_user})
    this.emailFirst.reset
  }

  //Mensajes de error
    getUserNameErrorMessage() {
      if(this.usernameDataForm.controls['name'].hasError('required')) {
        return 'Tenés que ingresar un valor'}
      if(this.usernameDataForm.controls['name'].hasError('minlength')) {
        return 'Este valor debe tener más de 4 caracteres'}
      if(this.usernameDataForm.controls['name'].hasError('maxlength')) {
        return 'Este valor debe tener menos de 25 caracteres'}
      return ''
    }
    getPasswordErrorMessageFirst() {
      if(this.passwordFirst.hasError('required')) {
        return 'Tenés que ingresar un valor'}
      if(this.passwordFirst.hasError('minlength')) {
        return 'Min. 4 caracteres'}
      if(this.passwordFirst.hasError('maxlength')) {
        return 'Max. 10 caracteres'}
      return ''
    }
    getPasswordErrorMessage() {
      if(this.setPasswordDataForm.controls['password'].hasError('no_equal')) {
        return 'Las contraseñas no coinciden'}
      return ''
    }
    getEmailFirstErrorMessage() {
      if(this.emailFirst.hasError('required')) {
        return 'Tenés que ingresar un valor'}
      if(this.emailFirst.hasError('minlength')) {
        return 'Min. 4 caracteres'}
      if(this.emailFirst.hasError('maxlength')) {
        return 'Max. 35 caracteres'}
      if(this.emailFirst.hasError('error_format')) {
        return 'No es un correo válido'}
      return ''
    }
    getEmailErrorMessage() {
      if(this.setEmailDataForm.controls['email'].hasError('required')) {
        return 'Tenés que ingresar un valor'}
      if(this.setEmailDataForm.controls['email'].hasError('no_equal')) {
        return 'Los correos electrónicos no coinciden'}
      if(this.setEmailDataForm.controls['email'].hasError('error_format')) {
        return 'No es un correo válido'}
      return ''
    }

  onSubmitUsername() {
    this.disable_username = true;
    this.loading_username =  true;
    this.formMsg.patchValue({
      tipo: 'change_user'
    })
    this._api.postTypeRequest('profile/update-username', this.usernameDataForm.value).subscribe({
      next: (res: any) => {
        this.loading_username =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó el usuario
            this._notify.showSuccess('Nombre de usuario actualizado!');
            this._auth.setDataInLocalStorage(res.data[0].id, res.token, res.data[0].state, res.data[0], this._auth.getRememberOption());
            this._api.postTypeRequest('user/envio-email', this.formMsg.value).subscribe();
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else{
            //No hubo modificación
            this.disable_username = false;
            this._notify.showError('No se detectaron cambios. Ingresá un nombre de usuario diferente al actual.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_username = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_username = false;
        this.loading_username =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

  onSubmitSetPassword() {
    this.disable_set_password = true;
    this.loading_set_password =  true;
    this.formMsg.patchValue({
      tipo: 'change_pass'
    })
    this._api.postTypeRequest('profile/update-password', this.setPasswordDataForm.value).subscribe({
      next: (res: any) => {
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó la contraseña
            this.loading_set_password =  false;
            this._notify.showSuccess('Contraseña actualizada!');
            this._auth.setRememberOption(false);
            setTimeout(() => {
              this._router.navigate(['../logoff']);
            }, 2000);
            this._api.postTypeRequest('user/envio-email', this.formMsg.value).subscribe();
          } else{
            //No hubo modificación
            this.disable_set_password = false;
            this.loading_set_password =  false;
            this._notify.showError('No se detectaron cambios. Ingresá una contraseña diferente al actual.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_set_password = false;
          this.loading_set_password =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_set_password = false;
        this.loading_set_password =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

  onSubmitSetEmail() {
    this.disable_set_email = true;
    this.loading_set_email =  true;
    const md5 = new Md5();
    const hash_code = Md5.hashStr(this.setEmailDataForm.get('email')?.value).slice(0,10);
    this.setEmailDataForm.controls['activation_code'].setValue(hash_code);
    md5.end();
    this._api.postTypeRequest('profile/update-email', this.setEmailDataForm.value).subscribe({
      next: (res: any) => {
        this.loading_set_email =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó el correo electrónico
            this._notify.showSuccess('Correo electrónico actualizado!');
            this._auth.setRememberOption(false);
            setTimeout(() => {
              this._router.navigate(['../logoff']);
            }, 2000);
          } else{
            //No hubo modificación
            this.disable_set_email = false;
            this._notify.showError('No se detectaron cambios. Ingresá un correo diferente al actual.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_set_email = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_set_email = false;
        this.loading_set_email =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

}
