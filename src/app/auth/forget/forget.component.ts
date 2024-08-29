import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html'
})
export class ForgetComponent implements OnInit {

  emailReg = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
  );
  forgotForm!: FormGroup;
  formMsg!: FormGroup;
  codeForm!: FormGroup;
  passwordForm!: FormGroup;
  loading_email!: boolean;
  loading_code!: boolean;
  loading_password!: boolean;
  show_window!: string;
  disable_submit!: boolean;

  hide_1!: boolean;
  hide_2!: boolean;
  passwordFirst!: FormControl;

  constructor(
    private _router: Router,
    private _api: ApiService,
    private _notify: NotificationService
  ) {
    this.loading_email = false;
    this.loading_code = false;
    this.loading_password = false;
    this.show_window = 'email';
    this.disable_submit = false;
    this.hide_1 = true;
    this.hide_2 = true;
    this.passwordFirst = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10)
    ]);
  }

  ngOnInit(): void {
    this.createEmailForm();
    this.createFormMsg();
    this.createCodeForm();
    this.createPasswordForm();
    this.passwordFirst.valueChanges.subscribe( value => {
      if( ((this.passwordForm.value.password.length > 3) && (this.passwordForm.value.password.length < 11) ) && (value !== this.passwordForm.value.password)) {
        this.passwordForm.controls['password'].setErrors({ no_equal: true });
      }
    })
  }

  createEmailForm(): void {
    this.forgotForm = new FormGroup({
        email : new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ])
    });
  }

  createFormMsg() {
    this.formMsg = new FormGroup({
      email: new FormControl(''),
      data: new FormControl(''),
      tipo: new FormControl('code')
  });
  }

  createCodeForm(): void {
    this.codeForm = new FormGroup({
        id: new FormControl(''),
        email: new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ]),
        activation_code: new FormControl('', [
          Validators.required,
          Validators.minLength(10)
        ])
    });
  }

  createPasswordForm(): void {
    this.passwordForm = new FormGroup({
        id: new FormControl(''),
        email: new FormControl(''),
        password : new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return (control.value !== this.passwordFirst.value) ? {no_equal: {value: control.value}} : null;}
        ])
    });
  }

  hidePassword_1(ev: any): void {
    ev.preventDefault();
    this.hide_1 = !this.hide_1;
  }
  hidePassword_2(ev: any): void {
    ev.preventDefault();
    this.hide_2 = !this.hide_2;
  }

  getEmailValidatorErrorMessage() {
    if(this.forgotForm.controls['email'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.forgotForm.controls['email'].hasError('error_format')) {
      return 'No es un correo válido'}
    return ''
  }
  getEmailErrorMessage() {
    if(this.codeForm.controls['email'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.codeForm.controls['email'].hasError('error_format')) {
      return 'No es un correo válido'}
    return ''
  }
  getCodeErrorMessage() {
    if(this.codeForm.controls['activation_code'].hasError('required')) {
      return 'Tenés que ingresar un código'}
    if(this.codeForm.controls['activation_code'].hasError('minlength')) {
      return 'El código debe tener 10 caracteres'}
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
    if(this.passwordForm.controls['password'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.passwordForm.controls['password'].hasError('no_equal')) {
      return 'Las contraseñas no coinciden'}
    return ''
  }

  goCode() {
    this.show_window = 'code';
  }
  goEmail() {
    this.show_window = 'email';
  }
  goPassword() {
    this.show_window = 'password';
  }

  sendEmail(): void {
    this.disable_submit = true;
    this.loading_email = true;
    this._api.postTypeRequest('user/verificate-email', this.forgotForm.value).subscribe({
      next: (res: any) => {
        if(res.status == 1){
          //No hubo error de conexión con la DB
          if(res.data.length){
            //Encontró el correo electrónico y devuelve el código de activación
            this.formMsg.patchValue({
              email: res.data[0].email,
              data: res.data[0].activation_code
            });
            this._api.postTypeRequest('user/envio-email', this.formMsg.value).subscribe({
              next: (res: any) => {
                this.loading_email =  false;
                if(res.status == 1){
                  //Email enviado o no
                  if(res.data == 'ok') {
                    this._notify.showSuccess('Código enviado con éxito!');
                    setTimeout(() => {
                      this.goCode();
                      this.disable_submit = false;
                    }, 2000);
                  } else {
                    this.disable_submit = false;
                    this._notify.showError('Ocurrió un problema al enviar el código a tu correo electrónico. Intentá nuevamente por favor.')
                  }
                } else {
                  this.disable_submit = false;
                  this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
                }
              },
              error: (error) => {
                //Error de conexión, no pudo consultar con la base de datos
                this.disable_submit = false;
                this.loading_email =  false;
                this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
              }
            });
          } else{
            //No encontró el correo electrónico
            this.disable_submit = false;
            this.loading_email =  false;
            this._notify.showError('El correo electrónico ingresado no esta registrado.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this.loading_email =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: () => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading_email =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

  sendCode() {
    this.disable_submit = true;
    this.loading_code = true;
    this._api.postTypeRequest('user/verificate-email', this.codeForm.value).subscribe({
      next: (res: any) => {
        this.loading_code =  false;
        if(res.status == 1){
          //No hubo error de conexión con la DB
          if(res.data.length){
            //Encontró el correo electrónico y devuelve el código de activación
            this.passwordForm.patchValue({
              id: res.data[0].id,
              email: res.data[0].email
            });
            this.formMsg.patchValue({
              email: res.data[0].email,
              data: '',
              tipo: 'change_pass',
            });
            if(res.data[0].activation_code === this.codeForm.value.activation_code) {
              //Código verificado
              this._notify.showSuccess('Verificación exitosa!');
              setTimeout(() => {
                this.goPassword();
                this.disable_submit = false;
              }, 2000);
            } else {
              //Código No verificado
              this.disable_submit = false;
              this._notify.showError('Hubo un problema con el código ingresado.');
            }
          } else{
            //No encontró el correo electrónico
            this.disable_submit = false;
            this._notify.showError('El correo electrónico ingresado no esta registrado.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: () => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading_code =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

  sendPassword() {
    this.disable_submit = true;
    this.loading_password = true;
    this._api.putTypeRequest('user/restore-password', this.passwordForm.value).subscribe({
      next: (res: any) => {
        this.loading_password =  false;
        if(res.status == 1){
          //No hubo error de conexión con la DB
          if(res.data.changedRows == 1){
            //Actualizó la contraseña
            this._notify.showSuccess('Has actualizado tu contraseña con éxito!');
            setTimeout(() => {
              this._router.navigate(['login']);
              this.disable_submit = false;
            }, 2000);
            this._api.postTypeRequest('user/envio-email', this.formMsg.value).subscribe();
          } else{
            //No se actualizó la contraseña
            this.disable_submit = false;
            this._notify.showWarn('La contraseña nueva no puede ser igual a la anterior.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: () => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading_password =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

}
