import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-username',
  templateUrl: './edit-username.component.html'
})
export class EditUsernameComponent implements OnInit {

  userDataForm!: FormGroup;

  ngOnInit(): void {
    this.createUserForm();
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        name : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(25)
        ])
    });
  }

  getUserNameErrorMessage() {
    if(this.userDataForm.controls['name'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['name'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['name'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 25 caracteres'}
    return ''
  }

  onSubmitUser() {
    console.log(this.userDataForm.value);
  }

}
