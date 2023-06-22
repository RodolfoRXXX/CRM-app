import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.component.html'
})
export class EditEmailComponent implements OnInit {

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
        email_new : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(35)
        ]),
        email_verify : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(35)
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
  getEmailNewErrorMessage() {
    if(this.userDataForm.controls['email_new'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['email_new'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['email_new'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 35 caracteres'}
    return ''
  }
  getEmailVerifyErrorMessage() {
    if(this.userDataForm.controls['email_verify'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['email_verify'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['email_verify'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 35 caracteres'}
    return ''
  }

  onSubmitChecker() {
    console.log(this.checkPassword.value);
  }

  onSubmitUser() {
    console.log(this.userDataForm.value);
  }

}
