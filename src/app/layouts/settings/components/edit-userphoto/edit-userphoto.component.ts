import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-userphoto',
  templateUrl: './edit-userphoto.component.html'
})
export class EditUserphotoComponent implements OnInit {

  userDataForm!: FormGroup;

  ngOnInit(): void {
    this.createUserForm();
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        image : new FormControl('', [
          Validators.required
        ])
    });
  }

  getImageErrorMessage() {
    if(this.userDataForm.controls['image'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    return ''
  }
  
  onSubmitUser() {
    console.log(this.userDataForm.value);
  }


}
