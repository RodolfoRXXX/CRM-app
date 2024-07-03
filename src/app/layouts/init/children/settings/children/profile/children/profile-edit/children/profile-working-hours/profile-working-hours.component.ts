import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-profile-working-hours',
  templateUrl: './profile-working-hours.component.html',
  styleUrls: ['./profile-working-hours.component.scss']
})
export class ProfileWorkingHoursComponent {

  @Input() employee!: Employee;

  dataForm!: FormGroup;
  loading: boolean = false;
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
  work_hour: any = {};

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
    private _notify: NotificationService
  ) {
    this.createDataForm();
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee']) {
      this.setDataForm(changes['employee'].currentValue)
    }
  }

  //Función que crea el formulario para editar los horarios de trabajo del empleado
  createDataForm(): void {
    this.dataForm = new FormGroup({
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
      })
    });
  }

  //Función que setea los valores iniciales del formulario
  setDataForm(employee: Employee) {
    const value = (employee.working_hours)?JSON.parse(employee.working_hours):'';
    this.work_hour = value;
    this.dataForm.patchValue({
      id: employee.id,
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
      }
    })
  }

  enableRange(e: any, day: string) {
    (day === 'monday_in')?((e.checked)?this.dataForm.get('work_hour.monday.monday_in')?.enable():(this.dataForm.get('work_hour.monday.monday_in')?.disable(),this.dataForm.get('work_hour.monday.monday_out')?.disable())):'';
    (day === 'monday_out')?(this.dataForm.get('work_hour.monday.monday_out')?.enable(), this.dataForm.get('work_hour.monday.monday_out')?.setValue(e)):'';
    (day === 'tuesday_in')?((e.checked)?this.dataForm.get('work_hour.tuesday.tuesday_in')?.enable():(this.dataForm.get('work_hour.tuesday.tuesday_in')?.disable(),this.dataForm.get('work_hour.tuesday.tuesday_out')?.disable())):'';
    (day === 'tuesday_out')?(this.dataForm.get('work_hour.tuesday.tuesday_out')?.enable(), this.dataForm.get('work_hour.tuesday.tuesday_out')?.setValue(e)):'';
    (day === 'wednesday_in')?((e.checked)?this.dataForm.get('work_hour.wednesday.wednesday_in')?.enable():(this.dataForm.get('work_hour.wednesday.wednesday_in')?.disable(),this.dataForm.get('work_hour.wednesday.wednesday_out')?.disable())):'';
    (day === 'wednesday_out')?(this.dataForm.get('work_hour.wednesday.wednesday_out')?.enable(), this.dataForm.get('work_hour.wednesday.wednesday_out')?.setValue(e)):'';
    (day === 'thursday_in')?((e.checked)?this.dataForm.get('work_hour.thursday.thursday_in')?.enable():(this.dataForm.get('work_hour.thursday.thursday_in')?.disable(),this.dataForm.get('work_hour.thursday.thursday_out')?.disable())):'';
    (day === 'thursday_out')?(this.dataForm.get('work_hour.thursday.thursday_out')?.enable(), this.dataForm.get('work_hour.thursday.thursday_out')?.setValue(e)):'';
    (day === 'friday_in')?((e.checked)?this.dataForm.get('work_hour.friday.friday_in')?.enable():(this.dataForm.get('work_hour.friday.friday_in')?.disable(),this.dataForm.get('work_hour.friday.friday_out')?.disable())):'';
    (day === 'friday_out')?(this.dataForm.get('work_hour.friday.friday_out')?.enable(), this.dataForm.get('work_hour.friday.friday_out')?.setValue(e)):'';
    (day === 'saturday_in')?((e.checked)?this.dataForm.get('work_hour.saturday.saturday_in')?.enable():(this.dataForm.get('work_hour.saturday.saturday_in')?.disable(),this.dataForm.get('work_hour.saturday.saturday_out')?.disable())):'';
    (day === 'saturday_out')?(this.dataForm.get('work_hour.saturday.saturday_out')?.enable(), this.dataForm.get('work_hour.saturday.saturday_out')?.setValue(e)):'';
    (day === 'sunday_in')?((e.checked)?this.dataForm.get('work_hour.sunday.sunday_in')?.enable():(this.dataForm.get('work_hour.sunday.sunday_in')?.disable(),this.dataForm.get('work_hour.sunday.sunday_out')?.disable())):'';
    (day === 'sunday_out')?(this.dataForm.get('work_hour.sunday.sunday_out')?.enable(), this.dataForm.get('work_hour.sunday.sunday_out')?.setValue(e)):'';
  }

  err_out() {
    if(this.dataForm.get('work_hour.monday.monday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.dataForm.get('work_hour.tuesday.tuesday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.dataForm.get('work_hour.wednesday.wednesday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.dataForm.get('work_hour.thursday.thursday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.dataForm.get('work_hour.friday.friday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.dataForm.get('work_hour.saturday.saturday_out')!.hasError('required')) return 'Ingresá un valor';
    if(this.dataForm.get('work_hour.sunday.sunday_out')!.hasError('required')) return 'Ingresá un valor';
    return ''
  }

  resetAll() {
    this.setDataForm(this.employee);
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
  }

  onSubmit() {
    this.loading = true;
    if(this.dataForm['value']['work_hour']) Object.assign(this.work_hour, this.dataForm['value']['work_hour']);
    this._api.postTypeRequest('profile/update-employee-work', {data: this.dataForm['value'], work_hour: this.work_hour}).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó la info
            this._notify.showSuccess('Información actualizada con éxito!');
            this._conector.setEmployee(res.data[0]);
            this.rechargeComponent();
          } else{
            //No hubo modificación
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favore.');
      }
    })
  }

}
