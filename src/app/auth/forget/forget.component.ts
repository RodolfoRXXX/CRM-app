import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html'
})
export class ForgetComponent implements OnInit {

  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  forgetForm!: FormGroup;

  constructor(
    private _router: Router,
    private _api: ApiService,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.forgetForm = new FormGroup({
        email : new FormControl('', [
          Validators.required,
          (control: AbstractControl):ValidationErrors|null => {
          return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ])
    });
  }

  getEmailErrorMessage() {
    if(this.forgetForm.controls['email'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.forgetForm.controls['email'].hasError('error_format')) {
      return 'No es un correo válido'}
    return ''
  }

  onSubmit(): void {
    console.log('Correo Enviado!');
  }

}
