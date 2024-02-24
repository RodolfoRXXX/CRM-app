import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { ImageService } from 'src/app/services/image.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html'
})
export class UserDataComponent implements OnInit {

  emailReg = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
  picDataForm!: FormGroup;
  userDataForm!: FormGroup;
  workDataForm!: FormGroup;
  loading!: boolean;
  load!: boolean;
  disable_pic!: boolean;
  disable_submit!: boolean;
  disable_submit_work!: boolean;
  employee!: Employee;
  base_image!: string;
  name_image!: string;
  error_image!: string;
  data: any = {
    id: 0,
    enterprise: '',
    name: '',
    blanck: true
  }
  screenLarge!: boolean;

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
    private _conector: ConectorsService,
    private _notify: NotificationService,
    private cdr: ChangeDetectorRef,
    private _image: ImageService,
    private _auth: AuthService,
  ) {
    this.base_image = '../../../../../assets/images/users/blanck_user.png'; 
    this.loading = false;
    this.disable_pic = true;
    this.disable_submit = false;
    this.disable_submit_work = false;
    this.load = false;
    this.setDataUser();
    this.createPicForm();
    this.createUserForm();
    this.createWorkForm();
  }

  ngOnInit(): void {
    //Carga los datos del empleado logueado
    this._conector.getEmployee().subscribe( employee => {
      if(employee.id != 0) {
        //empleado existente
        this.setFormUser(employee);
      }
    })

    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Configuración/Mi cuenta')

    //Carga el detector de tamaño del dispositivo
    this._conector.getScreenState().subscribe( screen => {
      this.screenLarge = screen
    } )
  }

  ngOnDestroy() {
    //Modifica el título de la vista principal al cerrar el componente
    this._conector.setUpdateTitle('Configuración')
  }

  async getDataUser(): Promise<any> {
    const data = await JSON.parse(this._auth.getDataFromLocalStorage());
    return data;
  }

  setDataUser() {
    this.getDataUser()
        .then( data => {
          this.name_image = data.thumbnail;
          this.base_image = environment.SERVER + this.name_image;
          this.data.id = data.id;
          this.data.enterprise = data.enterprise;
          if((data.name)&&(data.name.length)) {
            this.data.name = data.name
          } else {
            this.data.name = data.email.split("@")[0]
          }
          if(data.thumbnail != 'blanck_user.png') {
            this.data.blanck = false;
          }
        })
        .finally( () => this.error_image = '')
  }

  setFormUser(data: Employee) {
    this.userDataForm.setValue({
      id_user: data.id,
      name: data.name,
      email: data.email,
      address: data.address,
      date: data.date,
      phone: data.phone,
      mobile: data.mobile,
    })
    const value = (data.working_hours)?JSON.parse(data.working_hours):'';
    this.work_hour = value;
    this.workDataForm.setValue({
      id_user: data.id,
      work_hour: {
        monday: {
          monday_in: (value.monday)?value.monday.monday_in:'',
          monday_out: (value.monday)?value.monday.monday_out:''
        },
        tuesday: {
          tuesday_in: (value.tuesday)?value.tuesday.tuesday_in:'',
          tuesday_out: (value.tuesday)?value.tuesday.tuesday_out:''
        },
        wednesday: {
          wednesday_in: (value.wednesday)?value.wednesday.wednesday_in:'',
          wednesday_out: (value.wednesday)?value.wednesday.wednesday_out:''
        },
        thursday: {
          thursday_in: (value.thursday)?value.thursday.thursday_in:'',
          thursday_out: (value.thursday)?value.thursday.thursday_out:''
        },
        friday: {
          friday_in: (value.friday)?value.friday.friday_in:'',
          friday_out: (value.friday)?value.friday.friday_out:''
        },
        saturday: {
          saturday_in: (value.saturday)?value.saturday.saturday_in:'',
          saturday_out: (value.saturday)?value.saturday.saturday_out:''
        },
        sunday: {
          sunday_in: (value.sunday)?value.sunday.sunday_in:'',
          sunday_out: (value.sunday)?value.sunday.sunday_out:''
        },
      },
      name_er: data.name_er,
      phone_er: data.phone_er
    });
  }

  createPicForm(): void {
    this.picDataForm = new FormGroup({
        id: new FormControl(''),
        enterprise: new FormControl(''),
        name: new FormControl(''),
        thumbnail : new FormControl('', [
          Validators.required
        ]),
        blanck: new FormControl(true)
    });
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        id_user: new FormControl(''),
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
      id_user: new FormControl(''),
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

  capture_img(event: any) {
    this.load = true;
    const archivoCapturado = event.target.files[0];
    setTimeout(() => {
      if ((archivoCapturado.type == 'image/jpg') || (archivoCapturado.type == 'image/jpeg') || (archivoCapturado.type == 'image/png')){
        if ((archivoCapturado.size > 10240) && (archivoCapturado.size < 10485760)) {
          this._image.extraerBase64(archivoCapturado).then( (imagen:any) => {
            this.load = false;
            try {
              if(imagen.base){
                this.base_image = imagen.base;
                this.picDataForm.patchValue({
                  thumbnail: imagen.base
                })
                this.error_image = '';
                this.disable_pic = false;
              } else {
                this.base_image = '../../../../../assets/images/users/error_image.png';
                this.error_image = 'Ha ocurrido un error con la imagen';
                this.picDataForm.patchValue({
                  thumbnail: ''
                })
              }
            } catch (error) {
              this.base_image = '../../../../../assets/images/users/error_image.png';
              this.error_image = 'Ha ocurrido un error con la imagen';
              this.picDataForm.patchValue({
                thumbnail: ''
              })
            }
          });
        } else if(archivoCapturado.size > 10485760) {
          //error de peso mayor
          this.load = false;
          this.base_image = '../../../../../assets/images/users/error_image.png';
          this.error_image = 'La imagen no debe superar los 10MB';
          this.picDataForm.patchValue({
            thumbnail: ''
          })
        } else {
          //error de peso menor
          this.load = false;
          this.base_image = '../../../../../assets/images/users/error_image.png';
          this.error_image = 'La imagen debe superar los 50KB';
          this.picDataForm.patchValue({
            thumbnail: ''
          })
        }
      } else{
        //error de formato
        this.load = false;
        this.base_image = '../../../../../assets/images/users/error_image.png';
        this.error_image = 'La imagen tiene un formato incompatible';
        this.picDataForm.patchValue({
          thumbnail: ''
        })
      }
    }, 2500);
  }

  getError() {
    //name
    if(this.userDataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.userDataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';

    //email
    if(this.userDataForm.controls['email'].hasError('error_format')) return 'No es un correo válido';

    //address
    if(this.userDataForm.controls['address'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.userDataForm.controls['address'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['address'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';

    //phone
    if(this.userDataForm.controls['phone'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['phone'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';

    //mobile
    if(this.userDataForm.controls['mobile'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.userDataForm.controls['mobile'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['mobile'].hasError('maxlength')) return 'Este valor debe tener menos de 20 caracteres';

    //name-er
    if(this.workDataForm.controls['name_er'].hasError('minlength')) return 'Mínimo de 4 caracteres';
    if(this.workDataForm.controls['name_er'].hasError('maxlength')) return 'Máximo de 30 caracteres';

    //phone-er
    if(this.workDataForm.controls['phone_er'].hasError('minlength')) return 'Mínimo de 4 caracteres';
    if(this.workDataForm.controls['phone_er'].hasError('maxlength')) return 'Máximo de 15 caracteres';

    return ''
  }
  err_out() {
    if(this.workDataForm.get('work_hour.monday.monday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.workDataForm.get('work_hour.tuesday.tuesday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.workDataForm.get('work_hour.wednesday.wednesday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.workDataForm.get('work_hour.thursday.thursday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.workDataForm.get('work_hour.friday.friday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.workDataForm.get('work_hour.saturday.saturday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.workDataForm.get('work_hour.sunday.sunday_out')!.hasError('required')) return 'Ingresá un valor';
    return ''
  }
  getImageErrorMessage() {
    if(this.picDataForm.controls['thumbnail'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    return ''
  }

  onSubmitPic() {
    this.disable_pic = true;
    this.load = true;
    this.picDataForm.patchValue({
      id: this.data.id,
      blanck: this.data.blanck
    })
    this._api.postTypeRequest('profile/load-user-image', this.picDataForm.value).subscribe({
      next: (res: any) => {
        this.load =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó la imagen
            this._notify.showSuccess('Nueva imagen de usuario!');
            this._auth.setDataInLocalStorage(res.data[0].id, res.token, res.data[0].state, res.data[0], this._auth.getRememberOption());
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else{
            //No hubo modificación
            this._notify.showError('No se detectaron cambios. Ingresá una imagen diferente al actual.')
          }
        } else{
            //Problemas de conexión con la base de datos(res.status == 0)
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.load =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

  onSubmitUser() {
    this.disable_submit = true;
    this.loading = true;
    this._api.postTypeRequest('profile/update-employee-personal', this.userDataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó el usuario
            this._notify.showSuccess('Información actualizada con éxito!');
            this._conector.setEmployee(res.data[0]);
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.');
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
    if(this.workDataForm['value']['work_hour']) Object.assign(this.work_hour, this.workDataForm['value']['work_hour']);
    this._api.postTypeRequest('profile/update-employee-work', {data: this.workDataForm['value'], work_hour: this.work_hour}).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó el usuario
            this._notify.showSuccess('Información actualizada con éxito!');
            this._conector.setEmployee(res.data[0]);
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
