import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html'
})
export class UserDataComponent implements OnInit {

  userDataForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.userDataForm = new FormGroup({
        name : new FormControl('', [
          Validators.required,
        ]),
        address : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ]),
        phone : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ]),
    });
  }

  getNameErrorMessage() {

  }
  getAddressErrorMessage() {

  }
  getPhoneErrorMessage() {

  }

  onSubmitUser() {

  }

}
