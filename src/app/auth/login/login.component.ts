import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  
  emailReg = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
  );
  hide = true;
  loginForm!: FormGroup;
  loading!: boolean;
  disable_submit!: boolean;

  constructor(
    private _router: Router,
    private _api: ApiService,
    private _auth: AuthService,
    private _notify: NotificationService
  ) { 
    this.loading = false;
    this.disable_submit = false;
   }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = new FormGroup({
        email : new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ]),
        password : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ]),
        remember_me : new FormControl(false)
    });
  }

  hidePassword(ev: any): void {
    ev.preventDefault();
    this.hide = !this.hide;
  }
  getEmailErrorMessage() {
    if(this.loginForm.controls['email'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.loginForm.controls['email'].hasError('error_format')) {
      return 'No es un correo válido'}
    return ''
  }
  getPasswordErrorMessage() {
    if(this.loginForm.controls['password'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.loginForm.controls['password'].hasError('minlength')) {
      return 'Min. 4 caracteres'}
    if(this.loginForm.controls['password'].hasError('maxlength')) {
      return 'Max. 10 caracteres'}
    return ''
  }

  onSubmit(): void {
    this.disable_submit = true;
    this.loading = true;
    this._api.postTypeRequest('user/login', this.loginForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y encontró o no el usuario
          if(res.data.length){
            //Encontró el usuario
            this._notify.showSuccess('Acceso autorizado!');
            this._auth.setDataInLocalStorage(res.data[0].id, res.token, res.data[0].state, res.data[0], this.loginForm.value.remember_me);
            setTimeout(() => {
              this._router.navigate(['init']);
            }, 2000);
          } else{
            //No encontró el usuario
            this.disable_submit = false;
            this._notify.showError('Las credenciales de acceso no son correctas.')
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
