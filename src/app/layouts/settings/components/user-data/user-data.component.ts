import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html'
})
export class UserDataComponent implements OnInit {

  userDataForm!: FormGroup;
  workDataForm!: FormGroup;

  hours: any[] = [
    {value: '00', viewValue: '00:00'},
    {value: '01', viewValue: '01:00'},
    {value: '02', viewValue: '02:00'},
    {value: '03', viewValue: '03:00'},
    {value: '04', viewValue: '04:00'},
    {value: '05', viewValue: '05:00'},
    {value: '06', viewValue: '06:00'},
    {value: '07', viewValue: '07:00'},
    {value: '08', viewValue: '08:00'},
    {value: '09', viewValue: '09:00'},
    {value: '10', viewValue: '10:00'},
    {value: '11', viewValue: '11:00'},
    {value: '12', viewValue: '12:00'},
    {value: '13', viewValue: '13:00'},
    {value: '14', viewValue: '14:00'},
    {value: '15', viewValue: '15:00'},
    {value: '16', viewValue: '16:00'},
    {value: '17', viewValue: '17:00'},
    {value: '18', viewValue: '18:00'},
    {value: '19', viewValue: '19:00'},
    {value: '20', viewValue: '20:00'},
    {value: '21', viewValue: '21:00'},
    {value: '22', viewValue: '22:00'},
    {value: '23', viewValue: '23:00'}
  ];

  constructor() {}

  ngOnInit(): void {
    this.createUserForm();
    this.createWorkForm();
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        name : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        address : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        phone : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        date : new FormControl('', [
          Validators.required
        ]),
    });
  }

  createWorkForm(): void {
    this.workDataForm = new FormGroup({
        work_hour: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        name_er : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        phone_er : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ])
    });
  }

  getNameErrorMessage() {
    if(this.userDataForm.controls['name'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['name'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['name'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 30 caracteres'}
    return ''
  }
  getAddressErrorMessage() {
    if(this.userDataForm.controls['address'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['address'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['address'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 30 caracteres'}
    return ''
  }
  getPhoneErrorMessage() {
    if(this.userDataForm.controls['phone'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['phone'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['phone'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 15 caracteres'}
    return ''
  }
  getDateErrorMessage() {
    if(this.userDataForm.controls['date'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    return ''
  }
  getWorkHourErrorMessage() {

  }
  getNameErErrorMessage() {

  }
  getPhoneErErrorMessage() {

  }

  onSubmitUser() {

  }

  onSubmitWork() {

  }

}
