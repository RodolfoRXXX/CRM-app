import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { isEmpty } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  
  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  hide = true;
  loginForm!: FormGroup;

  constructor(
    private _router: Router,
    private _api: ApiService,
    private _auth: AuthService
  ) {}

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
        remember_me : new FormControl('')
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
    this._api.getTypeRequest(`user/?email=${this.loginForm.value.email}&password=${this.loginForm.value.password}`).subscribe({
      next: (res: any) => {
        if(res.length){
            this._auth.setDataInLocalStorage(res[0].id, "", res[0], this.loginForm.value.remember_me);
            this._router.navigate(['init']);
        } else{
          //devuelve error
          console.log('error de logueo')
        }
      },
      error: (error) => {
        //ventana de error
        console.log(error)
      }
    }) 
  }

}
