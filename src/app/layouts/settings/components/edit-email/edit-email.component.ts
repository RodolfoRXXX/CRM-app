import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.component.html'
})
export class EditEmailComponent implements OnInit {

  hide = true;
  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  userDataForm!: FormGroup;
  checkPassword!: FormGroup;
  formMsg!: FormGroup;
  emailFirst!: FormControl;
  color: string;
  icon: string;
  btn_verify_pass: boolean;
  loading: boolean;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router,
    private _notify: NotificationService
  ) {
    this.loading = false;
    this.color = 'primary';
    this.icon = 'search';
    this.btn_verify_pass = false;
    this.emailFirst = new FormControl({value: '', disabled: true}, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(35),
      (control: AbstractControl):ValidationErrors|null => {
      return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
    ]);
   }

  ngOnInit(): void {
    this.checkPasswordForm();
    this.createUserForm();
    this.getDataUser();
    this.creeateFormMsg();
    this.emailFirst.valueChanges.subscribe( value => {
      if(value !== this.userDataForm.value.email) {
        this.userDataForm.controls['email'].setErrors({ no_equal: true });
      }
    })
    this.userDataForm.controls['email'].valueChanges.subscribe( value => {
      if(value !== this.emailFirst.value) {
        this.userDataForm.controls['email'].setErrors({ no_equal: true });
      }
    })
  }

  getDataUser() {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
      this.checkPassword.patchValue({
        id: data.id
      });
      this.userDataForm.patchValue({
        id: data.id
      })
  }

  hidePassword(ev: any): void {
    ev.preventDefault();
    this.hide = !this.hide;
  }

  clean_btn_verify() {
    this.btn_verify_pass = false;
    this.icon = 'search';
    this.color = 'primary';
  }

  checkPasswordForm(): void {
    this.checkPassword = new FormGroup({
        id: new FormControl(''),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ])
    });
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        id: new FormControl(''),
        email : new FormControl({value: '', disabled: true}, [
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

  creeateFormMsg() {
    this.formMsg = new FormGroup({
      email: new FormControl(''),
      data: new FormControl(''),
      tipo: new FormControl('change_mail')
    });
  }

  getPasswordErrorMessage() {
    if(this.checkPassword.controls['password'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.checkPassword.controls['password'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.checkPassword.controls['password'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 10 caracteres'}
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
    if(this.userDataForm.controls['email'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['email'].hasError('no_equal')) {
      return 'Los correos electrónicos no coinciden'}
    if(this.userDataForm.controls['email'].hasError('error_format')) {
      return 'No es un correo válido'}
    return ''
  }

  onSubmitChecker() {
    if(!this.checkPassword.get('password')!.disabled) {
      if(this.checkPassword.controls['password'].value.length > 3 && this.checkPassword.controls['password'].value.length < 11) {
        this.loading = true;
        this.btn_verify_pass = true;
        this._api.postTypeRequest('profile/verificate-password', this.checkPassword.value).subscribe({
          next: (res: any) => {
            if(res.status == 1){
              if(res.data.length) {
                //Verificó la contraseña
                this.loading = false;
                this.btn_verify_pass = false;
                this.icon = 'check';
                this.color = 'accent';
                this._notify.showSuccess('Contraseña verificada!');
                this.checkPassword.get('password')!.disable();
                this.emailFirst?.enable();
                this.userDataForm.get('email')?.enable();
              } else {
                //No verificó la contraseña
                this.loading = false;
                this.btn_verify_pass = false;
                this.icon = 'close';
                this.color = 'warn';
                this._notify.showError('Contraseña NO verificada.');
              }
            } else{
              //Problemas de conexión con la base de datos(res.status == 0)
              this.loading = false;
              this.btn_verify_pass = false;
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
            }
          },
          error: (error) => {
            //Error de conexión, no pudo consultar con la base de datos
            this.loading = false;
            this.btn_verify_pass = false;
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
          }
        })
      }
    }  
  }

  onSubmitUser() {
    this.loading =  true;
    const md5 = new Md5();
    const hash_code = Md5.hashStr(this.userDataForm.get('email')?.value).slice(0,10);
    this.userDataForm.controls['activation_code'].setValue(hash_code);
    md5.end();
    this.formMsg.patchValue({
      email: this.userDataForm.get('email')?.value,
      data: hash_code
    });
    this._api.postTypeRequest('profile/update-email', this.userDataForm.value).subscribe({
      next: (res: any) => {
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó el correo electrónico
            this._api.postTypeRequest('user/envio-email', this.formMsg.value).subscribe();
            this.loading =  false;
            this._notify.showSuccess('Correo electrónico actualizado!');
            this._auth.setRememberOption(false);
            setTimeout(() => {
              this._router.navigate(['../logoff']);
            }, 2000);
          } else{
            //No hubo modificación
            this.loading =  false;
            this._notify.showError('No se detectaron cambios. Ingresá un correo diferente al actual.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error) => {
        console.log(error)
        //Error de conexión, no pudo consultar con la base de datos
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

}
