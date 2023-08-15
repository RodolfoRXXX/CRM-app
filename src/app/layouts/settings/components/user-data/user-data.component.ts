import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html'
})
export class UserDataComponent implements OnInit {

  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  userDataForm!: FormGroup;
  workDataForm!: FormGroup;
  loading!: boolean;
  disable_submit!: boolean;
  disable_submit_work!: boolean;

  work_hour: any = {}

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

  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _conector: ConectorsService,
    private _notify: NotificationService
  ) { 
    this.loading = false;
    this.disable_submit = false;
    this.disable_submit_work = false;
    this.setDataUser();
  }

  ngOnInit(): void {
    this.createUserForm();
    this.createWorkForm();
  }

  async getDataUser(): Promise<any> {
    const data = await JSON.parse(this._auth.getDataFromLocalStorage());
    return data;
  }

  setDataUser() {
    this.getDataUser()
        .then( data => {
          this._api.postTypeRequest('profile/get-employee', {id: data.id}).subscribe({
            next: (res: any) => {
              if(res.status == 1){
                //Accedió a la base de datos y no hubo problemas
                if(res.data.length) {
                  this.setFormUser(res.data[0]);
                  this.setFormWork(res.data[0]);
                } else {
                  this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
                }
              } else{
                  //Problemas de conexión con la base de datos(res.status == 0)
                  this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
              }
            },
            error: (error) => {
              //Error de conexión, no pudo consultar con la base de datos
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
            }
          })
        })
  }

  setFormUser(data: any) {
    this.userDataForm.controls['id'].setValue(data.id);
    this.userDataForm.controls['name'].setValue(data.name);
    this.userDataForm.controls['email'].setValue(data.email);
    this.userDataForm.controls['address'].setValue(data.address);
    this.userDataForm.controls['date'].setValue(data.date);
    this.userDataForm.controls['phone'].setValue(data.phone);
    this.userDataForm.controls['mobile'].setValue(data.mobile);
  }
  setFormWork(data: any) {
    this.workDataForm.controls['id'].setValue(data.id);
    const value = (data.working_hours)?JSON.parse(data.working_hours):'';
    this.work_hour = value;
    (value.monday)?this.workDataForm.get('work_hour.monday.monday_in')?.setValue(value.monday.monday_in):'';
    (value.monday)?this.workDataForm.get('work_hour.monday.monday_out')?.setValue(value.monday.monday_out):'';
    (value.tuesday)?this.workDataForm.get('work_hour.tuesday.tuesday_in')?.setValue(value.tuesday.tuesday_in):'';
    (value.tuesday)?this.workDataForm.get('work_hour.tuesday.tuesday_out')?.setValue(value.tuesday.tuesday_out):'';
    (value.wednesday)?this.workDataForm.get('work_hour.wednesday.wednesday_in')?.setValue(value.wednesday.wednesday_in):'';
    (value.wednesday)?this.workDataForm.get('work_hour.wednesday.wednesday_out')?.setValue(value.wednesday.wednesday_out):'';
    (value.thursday)?this.workDataForm.get('work_hour.thursday.thursday_in')?.setValue(value.thursday.thursday_in):'';
    (value.thursday)?this.workDataForm.get('work_hour.thursday.thursday_out')?.setValue(value.thursday.thursday_out):'';
    (value.friday)?this.workDataForm.get('work_hour.friday.friday_in')?.setValue(value.friday.friday_in):'';
    (value.friday)?this.workDataForm.get('work_hour.friday.friday_out')?.setValue(value.friday.friday_out):'';
    (value.saturday)?this.workDataForm.get('work_hour.saturday.saturday_in')?.setValue(value.saturday.saturday_in):'';
    (value.saturday)?this.workDataForm.get('work_hour.saturday.saturday_out')?.setValue(value.saturday.saturday_out):'';
    (value.sunday)?this.workDataForm.get('work_hour.sunday.sunday_in')?.setValue(value.sunday.sunday_in):'';
    (value.sunday)?this.workDataForm.get('work_hour.sunday.sunday_out')?.setValue(value.sunday.sunday_out):'';
    (data.name_er)?this.workDataForm.controls['name_er'].setValue(data.name_er):'';
    (data.phone_er)?this.workDataForm.controls['phone_er'].setValue(data.phone_er):'';
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        id: new FormControl(''),
        name : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        email : new FormControl('', [
          (control: AbstractControl):ValidationErrors|null => {
          return (!this.emailReg.test(control.value)&&(control.value.length)) ? {error_format: {value: control.value}} : null;}
        ]),
        address : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        date : new FormControl(''),
        phone : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        mobile : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20)
        ]),
    });
  }

  createWorkForm(): void {
    this.workDataForm = new FormGroup({
      id: new FormControl(''),
      work_hour: new FormGroup({
        monday: new FormGroup({
          monday_in: new FormControl({ value: '', disabled: true }),
          monday_out: new FormControl({ value: '', disabled: true }, [
            Validators.required
          ]),
        }),
        tuesday: new FormGroup({
          tuesday_in: new FormControl({ value: '', disabled: true }),
          tuesday_out: new FormControl({ value: '', disabled: true }, [
            Validators.required
          ]),
        }),
        wednesday: new FormGroup({
          wednesday_in: new FormControl({ value: '', disabled: true }),
          wednesday_out: new FormControl({ value: '', disabled: true }, [
            Validators.required
          ]),
        }),
        thursday: new FormGroup({
          thursday_in: new FormControl({ value: '', disabled: true }),
          thursday_out: new FormControl({ value: '', disabled: true }, [
            Validators.required
          ]),
        }),
        friday: new FormGroup({
          friday_in: new FormControl({ value: '', disabled: true }),
          friday_out: new FormControl({ value: '', disabled: true }, [
            Validators.required
          ]),
        }),
        saturday: new FormGroup({
          saturday_in: new FormControl({ value: '', disabled: true }),
          saturday_out: new FormControl({ value: '', disabled: true }, [
            Validators.required
          ]),
        }),
        sunday: new FormGroup({
          sunday_in: new FormControl({ value: '', disabled: true }),
          sunday_out: new FormControl({ value: '', disabled: true }, [
            Validators.required
          ]),
        })
      }),
      name_er : new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(30)
      ]),
      phone_er : new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(15)
      ])
    });
  }

  enableRange(e: any, day: string) {
    (day === 'monday_in')?((e.checked)?this.workDataForm.get('work_hour.monday.monday_in')?.enable():(this.workDataForm.get('work_hour.monday.monday_in')?.disable(),this.workDataForm.get('work_hour.monday.monday_out')?.disable())):'';
    (day === 'monday_out')?(this.workDataForm.get('work_hour.monday.monday_out')?.enable(), this.workDataForm.get('work_hour.monday.monday_out')?.setValue(e)):'';
    (day === 'tuesday_in')?((e.checked)?this.workDataForm.get('work_hour.tuesday.tuesday_in')?.enable():(this.workDataForm.get('work_hour.tuesday.tuesday_in')?.disable(),this.workDataForm.get('work_hour.tuesday.tuesday_out')?.disable())):'';
    (day === 'tuesday_out')?(this.workDataForm.get('work_hour.tuesday.tuesday_out')?.enable(), this.workDataForm.get('work_hour.tuesday.tuesday_out')?.setValue(e)):'';
    (day === 'wednesday_in')?((e.checked)?this.workDataForm.get('work_hour.wednesday.wednesday_in')?.enable():(this.workDataForm.get('work_hour.wednesday.wednesday_in')?.disable(),this.workDataForm.get('work_hour.wednesday.wednesday_out')?.disable())):'';
    (day === 'wednesday_out')?(this.workDataForm.get('work_hour.wednesday.wednesday_out')?.enable(), this.workDataForm.get('work_hour.wednesday.wednesday_out')?.setValue(e)):'';
    (day === 'thursday_in')?((e.checked)?this.workDataForm.get('work_hour.thursday.thursday_in')?.enable():(this.workDataForm.get('work_hour.thursday.thursday_in')?.disable(),this.workDataForm.get('work_hour.thursday.thursday_out')?.disable())):'';
    (day === 'thursday_out')?(this.workDataForm.get('work_hour.thursday.thursday_out')?.enable(), this.workDataForm.get('work_hour.thursday.thursday_out')?.setValue(e)):'';
    (day === 'friday_in')?((e.checked)?this.workDataForm.get('work_hour.friday.friday_in')?.enable():(this.workDataForm.get('work_hour.friday.friday_in')?.disable(),this.workDataForm.get('work_hour.friday.friday_out')?.disable())):'';
    (day === 'friday_out')?(this.workDataForm.get('work_hour.friday.friday_out')?.enable(), this.workDataForm.get('work_hour.friday.friday_out')?.setValue(e)):'';
    (day === 'saturday_in')?((e.checked)?this.workDataForm.get('work_hour.saturday.saturday_in')?.enable():(this.workDataForm.get('work_hour.saturday.saturday_in')?.disable(),this.workDataForm.get('work_hour.saturday.saturday_out')?.disable())):'';
    (day === 'saturday_out')?(this.workDataForm.get('work_hour.saturday.saturday_out')?.enable(), this.workDataForm.get('work_hour.saturday.saturday_out')?.setValue(e)):'';
    (day === 'sunday_in')?((e.checked)?this.workDataForm.get('work_hour.sunday.sunday_in')?.enable():(this.workDataForm.get('work_hour.sunday.sunday_in')?.disable(),this.workDataForm.get('work_hour.sunday.sunday_out')?.disable())):'';
    (day === 'sunday_out')?(this.workDataForm.get('work_hour.sunday.sunday_out')?.enable(), this.workDataForm.get('work_hour.sunday.sunday_out')?.setValue(e)):'';
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
  getEmailErrorMessage() {
    if(this.userDataForm.controls['email'].hasError('error_format')) {
      return 'No es un correo válido'}
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
    if(this.userDataForm.controls['phone'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['phone'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 15 caracteres'}
    return ''
  }
  getMobileErrorMessage() {
    if(this.userDataForm.controls['mobile'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['mobile'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['mobile'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 20 caracteres'}
    return ''
  }
  getNameErErrorMessage() {
    if(this.workDataForm.controls['name_er'].hasError('minlength')) {
      return 'Mínimo de 4 caracteres'}
    if(this.workDataForm.controls['name_er'].hasError('maxlength')) {
      return 'Máximo de 30 caracteres'}
    return ''
  }
  getPhoneErErrorMessage() {
    if(this.workDataForm.controls['phone_er'].hasError('minlength')) {
      return 'Mínimo de 4 caracteres'}
    if(this.workDataForm.controls['phone_er'].hasError('maxlength')) {
      return 'Máximo de 15 caracteres'}
    return ''
  }
  err_out() {
    if(this.workDataForm.get('work_hour.monday.monday_out')!.hasError('required')) {
      return 'Ingresá un valor'}
    if(this.workDataForm.get('work_hour.tuesday.tuesday_out')!.hasError('required')) {
      return 'Ingresá un valor'}
    if(this.workDataForm.get('work_hour.wednesday.wednesday_out')!.hasError('required')) {
      return 'Ingresá un valor'}
    if(this.workDataForm.get('work_hour.thursday.thursday_out')!.hasError('required')) {
      return 'Ingresá un valor'}
    if(this.workDataForm.get('work_hour.friday.friday_out')!.hasError('required')) {
      return 'Ingresá un valor'}
    if(this.workDataForm.get('work_hour.saturday.saturday_out')!.hasError('required')) {
      return 'Ingresá un valor'}
    if(this.workDataForm.get('work_hour.sunday.sunday_out')!.hasError('required')) {
      return 'Ingresá un valor'}
    return ''
  }

  onSubmitUser() {
    console.log(this.userDataForm.value);
    this.disable_submit = true;
    this.loading = true;
    this._api.postTypeRequest('profile/update-employee-personal', this.userDataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó el usuario
            this._notify.showSuccess('Información actualizada con éxito!');
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
          }
          setTimeout(() => {
            this._conector.setUpdate(true);
          }, 2000);
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })
  }

  onSubmitWork() {
    this.disable_submit_work = true;
    this.loading = true;
    Object.assign(this.workDataForm.value.work_hour, this.work_hour);
    this._api.postTypeRequest('profile/update-employee-work', this.workDataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó el usuario
            this._notify.showSuccess('Información actualizada con éxito!');
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
          }
          setTimeout(() => {
            this._conector.setUpdate(true);
          }, 2000);
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favore.');
      }
    })
  }

}
