import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html'
})
export class ForgetComponent implements OnInit {

  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  forgetForm!: FormGroup;
  codeForm!: FormGroup;
  passwordForm!: FormGroup;
  loading_email: boolean = false;
  loading_code: boolean = false;
  loading_password: boolean = false;
  show_window: string = 'email';

  hide_1 = true;
  hide_2 = true;
  passwordFirst!: FormControl;

  constructor(
    private _router: Router,
    private _api: ApiService,
    private _auth: AuthService,
    private _notify: NotificationService
  ) {
    this.passwordFirst = new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10)
    ]);
  }

  ngOnInit(): void {
    this.createEmailForm();
    this.createCodeForm();
    this.createPasswordForm();
    this.passwordFirst.valueChanges.subscribe( value => {
      if( ((this.passwordForm.value.password.length > 3) && (this.passwordForm.value.password.length < 11) ) && (value !== this.passwordForm.value.password)) {
        this.passwordForm.controls['password'].setErrors({ no_equal: true });
      }
    })
  }

  createEmailForm(): void {
    this.forgetForm = new FormGroup({
        email_validator : new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ])
    });
  }

  createCodeForm(): void {
    this.codeForm = new FormGroup({
        email: new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ]),
        activation_code: new FormControl('', [
          Validators.required,
          Validators.minLength(10)
        ])
    }
    );
  }

  createPasswordForm(): void {
    this.passwordForm = new FormGroup({
        email : new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ]),
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
    if(this.forgetForm.controls['email_validator'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.forgetForm.controls['email_validator'].hasError('error_format')) {
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
    this._notify.showSuccess('Correo enviado!');
    this.forgetForm.value;
  }

  sendCode() {
    this.codeForm.value;
  }

  sendPassword() {
    this.passwordForm.value;
  }

}
