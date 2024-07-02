import { Component, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss']
})
export class ProfileInformationComponent {

  @Input() employee!: Employee;

  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  dataForm!: FormGroup;
  load: boolean = true;
  loading: boolean = false;

  constructor(

  ) {
    this.createDataForm();
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.setDataForm(changes['employee'].currentValue)
      this.load = false;
    }
  }

  //Función que crea el formulario para editar los datos básicos del empleado
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(''),
        name : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        date : new FormControl(''),
        email : new FormControl('', [
          (control: AbstractControl):ValidationErrors|null => {
          return (!this.emailReg.test(control.value)&&(control.value.length)) ? {error_format: {value: control.value}} : null;},
          Validators.maxLength(30)
        ]),
        address : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        phone : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        mobile : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20)
        ]),
        city: new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(50)
        ]),
        state: new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(50)
        ]),
        country: new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(50)
        ])
    });
  }

  //Setea los valores del formulario si tuviera que cargarse un empleado
  setDataForm(employee: Employee) {
    this.dataForm.setValue({
      id: (employee.id > 0)?employee.id:'',
      name: (employee.name != '')?employee.name:'',
      date: (employee.date != '')?employee.date:'',
      email: (employee.email != '')?employee.email:'',
      address: (employee.address != '')?employee.address:'',
      phone: (employee.phone != '')?employee.phone:'',
      mobile: (employee.mobile != '')?employee.mobile:'',
      city: (employee.city != '')?employee.city:'',
      state: (employee.state != '')?employee.state:'',
      country: (employee.country != '')?employee.country:'',
    })
  }

  getErrorName() {
    //name
    if(this.dataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';
    return ''
  }
  getErrorEmail() {
    //email
    if(this.dataForm.controls['email'].hasError('error_format')) return 'No es un correo válido';
    if(this.dataForm.controls['email'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
    return ''
  }
  getErrorAddress() {
    //address
    if(this.dataForm.controls['address'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['address'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['address'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';
    return ''
  }
  getErrorCity() {
    //city
    if(this.dataForm.controls['city'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['city'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
    return ''
  }
  getErrorState() {
    //state
    if(this.dataForm.controls['state'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['state'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
    return ''
  }
  getErrorCountry() {
    //country
    if(this.dataForm.controls['country'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['country'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
    return ''
  }
  getErrorPhone() {
    //phone
    if(this.dataForm.controls['phone'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['phone'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';
    return ''
  }
  getErrorMobile() {
    //mobile
    if(this.dataForm.controls['mobile'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['mobile'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['mobile'].hasError('maxlength')) return 'Este valor debe tener menos de 20 caracteres';
    return ''
  }

  resetAll() {

  }

  onSubmit() {
    console.log(this.dataForm.value)
  }

}
