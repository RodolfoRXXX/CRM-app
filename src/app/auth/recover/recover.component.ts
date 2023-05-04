import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html'
})
export class RecoverComponent implements OnInit {

  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  hide_1 = true;
  hide_2 = true;
  recoverForm!: FormGroup;
  enterprises: Array<any> = [];
  passwordFirst!: FormControl;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router
  ) { 
    this.getEnterprises();
    this.passwordFirst = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10)
    ]);
   }

  ngOnInit(): void {
    this.createForm();
    this.passwordFirst.valueChanges.subscribe( value => {
      if( ((this.recoverForm.value.password.length > 3) && (this.recoverForm.value.password.length < 11) ) && (value !== this.recoverForm.value.password)) {
        this.recoverForm.controls['password'].setErrors({ no_equal: true });
      }
    } )
  }

  createForm(): void {
    this.recoverForm = new FormGroup({
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
        id_enterprise: new FormControl('', [
          Validators.required
        ]),
        code: new FormControl('', [
          Validators.required,
          Validators.minLength(10)
        ])
    }
    );
  }

  getEnterprises() {
    this._api.getTypeRequest(`enterprise`).subscribe({
      next: (res: any) => {
        if(res.length){
            this.enterprises = res;
        } else{
          //devuelve error
          console.log('array vacío')
        }
      },
      error: (error) => {
        //ventana de error
        console.log(error)
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

  getEmailErrorMessage() {
    if(this.recoverForm.controls['email'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.recoverForm.controls['email'].hasError('error_format')) {
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
    if(this.recoverForm.controls['password'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.recoverForm.controls['password'].hasError('no_equal')) {
      return 'Las contraseñas no coinciden'}
    return ''
  }
  getCodeErrorMessage() {
    if(this.recoverForm.controls['code'].hasError('required')) {
      return 'Tenés que ingresar un código'}
    if(this.recoverForm.controls['code'].hasError('minlength')) {
      return 'El código debe tener 10 caracteres'}
    return ''
  }

  onSubmit() {
    this._api.getTypeRequest(`user/?email=${this.recoverForm.value.email}&id_enterprise=${this.recoverForm.value.id_enterprise}&code=${this.recoverForm.value.code}`).subscribe({
      next: (res: any) => {
        if(res.length) {
          this._api.patchTypeRequest(`user/${res[0].id}`, { password: this.recoverForm.value.password }).subscribe({
            next: (res:any) => {
              if(res){
                this._router.navigate(['login']);
              }else {
                console.log("Sin cambios");
              }
            },
            error: (error) => {
              //Ventana de error de cambio
              console.log('Error del patch:' + error)
            }
          })
        }else {
          //ventana de error
          console.log('No se ha podido encontrar la cuenta a modificar');
        }
      },
      error: (error) => {
        //ventana de error
        console.log('Error del get:' + error)
      }
    })
  }

}
