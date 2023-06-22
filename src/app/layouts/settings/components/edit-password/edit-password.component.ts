import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html'
})
export class EditPasswordComponent implements OnInit {

  userDataForm!: FormGroup;
  checkPassword!: FormGroup;

  ngOnInit(): void {
    this.checkPasswordForm();
    this.createUserForm();
  }

  checkPasswordForm(): void {
    this.checkPassword = new FormGroup({
        password_old : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ])
    });
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        password_new : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ]),
        password_verify : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ]),
    });
  }

  getPasswordOldErrorMessage() {
    if(this.checkPassword.controls['password_old'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.checkPassword.controls['password_old'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.checkPassword.controls['password_old'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 10 caracteres'}
    return ''
  }
  getPasswordNewErrorMessage() {
    if(this.userDataForm.controls['password_new'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['password_new'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['password_new'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 10 caracteres'}
    return ''
  }
  getPasswordVerifyErrorMessage() {
    if(this.userDataForm.controls['password_verify'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['password_verify'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['password_verify'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 10 caracteres'}
    return ''
  }

  onSubmitChecker() {
    console.log(this.checkPassword.value);
  }

  onSubmitUser() {
    console.log(this.userDataForm.value);
  }

}
