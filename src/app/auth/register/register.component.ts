import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { generateUniqueId } from 'src/app/shared/functions/operation.function';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  emailReg = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
  );
  hide_1!: boolean;
  hide_2!: boolean;
  registerForm!: FormGroup;
  formMsg!: FormGroup;
  enterprises: Array<any> = [];
  passwordFirst!: FormControl;
  loading!: boolean;
  disable_submit!: boolean;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router,
    private _notify: NotificationService
  ) {
    this.hide_1 = true;
    this.hide_2 = true;
    this.loading = false;
    this.disable_submit = false;
    this.getEnterprises();
    this.passwordFirst = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10)
    ]);
   }

  ngOnInit(): void {
    this.createForm();
    this.createFormMsg();
    this.passwordFirst.valueChanges.subscribe( value => {
      if( ((this.registerForm.value.password.length > 3) && (this.registerForm.value.password.length < 11) ) && (value !== this.registerForm.value.password)) {
        this.registerForm.controls['password'].setErrors({ no_equal: true });
      }
    })
  }

  createForm(): void {
    this.registerForm = new FormGroup({
        name : new FormControl(''),
        email : new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ]),
        password : new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return (control.value !== this.passwordFirst.value) ? {no_equal: {value: control.value}} : null;}
        ]),
        thumbnail: new FormControl('no-image.png'),
        id_enterprise: new FormControl('', [
          Validators.required
        ]),
        activation_code: new FormControl(''),
        state: new FormControl(0),
        agree_policy : new FormControl(false, [
          Validators.required,
        ])
    }
    );
  }

  createFormMsg() {
    this.formMsg = new FormGroup({
      email: new FormControl(''),
      data: new FormControl(''),
      tipo: new FormControl('register')
    });
  }

  getEnterprises() {
    this._api.getTypeRequest('user/get-enterprises').subscribe({
      next: (res: any) => {
        if(res.status == 1) {
          if(res.data.length){
            this.enterprises = res.data;
          } else{
            //Array vacío
            this._notify.showWarn('Ha ocurrido un problema. Por favor recargá la página.');
          }
        } else{
          //Error de conexión con la base de datos
          this._notify.showWarn('Ha ocurrido un problema. Por favor recargá la página.');
        }
      },
      error: (error) => {
        //Error de conexión con la base de datos
        this._notify.showWarn('Ha ocurrido un problema. Por favor recargá la página.');
      }
    })
  }

  hidePassword_1(ev: any): void {
    ev.preventDefault();
    this.hide_1 = !this.hide_1;
  }

  hidePassword_2(ev: any): void {
    ev.preventDefault();
    this.hide_2 = !this.hide_2;
  }

  //Error message section

  getEmailErrorMessage() {
    if(this.registerForm.controls['email'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.registerForm.controls['email'].hasError('error_format')) {
      return 'No es un correo válido'}
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
    if(this.registerForm.controls['password'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.registerForm.controls['password'].hasError('no_equal')) {
      return 'Las contraseñas no coinciden'}
    return ''
  }

  onSubmit() {
    this.disable_submit = true;
    this.loading =  true;
    const hash_code = generateUniqueId(10);
    this.formMsg.patchValue({
      email: this.registerForm.get('email')?.value,
      data: hash_code
    });
    this.registerForm.controls['activation_code'].patchValue(hash_code);
    this._api.postTypeRequest('user/register', this.registerForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          if(res.data == 'existente') {
            this.disable_submit = false;
            this._notify.showError('El correo ya pertenece a un usuario registrado.');
          } else {
            //Creó el usuario
            this._notify.showSuccess('Usuario nuevo creado!');
            this._auth.setDataInLocalStorage(res.data[0].id, res.token, res.data[0].state, res.data[0], false);
            setTimeout(() => {
              this._router.navigate(['init']);
            }, 2000);
            this._api.postTypeRequest('user/envio-email', this.formMsg.value).subscribe({
              next: (res: any) => {
                if(res.status == 1){
                  if(res.data == 'ok') {
                    //envío de email exitoso!
                    this._notify.showSuccess('Se envió un correo a tu cuenta con el código de verificación.');
                  } else {
                    //no se envío el email
                    this._notify.showError('No se pudo enviar el correo con el código de verificación.');
                  }
                } else{
                  //no se envío el email
                  this._notify.showError('No se pudo enviar el correo con el código de verificación.');
                }
              },
              error: (error) => {
                //Error de conexión, no pudo consultar con la base de datos
                this._notify.showError('No se pudo enviar el correo con el código de verificación.');
              }
            });
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })
  }

}

