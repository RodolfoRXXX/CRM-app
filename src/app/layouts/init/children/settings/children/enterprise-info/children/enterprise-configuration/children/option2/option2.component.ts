import { Component, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';

@Component({
  selector: 'app-option2',
  templateUrl: './option2.component.html',
  styleUrls: ['./option2.component.scss']
})
export class Option2Component {

  @Input() enterprise!: Enterprise;

  dataForm!: FormGroup;
  loading: boolean = false;
  recharge: boolean = false;
  edit: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'edit'];
  dataSource = new MatTableDataSource();

  constructor(
    private _api: ApiService,
    private _notify: NotificationService
  ) {
    this.createDataForm();
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['enterprise']) {
      console.log(changes['enterprise'].currentValue)
      this.setTable(changes['enterprise'].currentValue.id)
      this.setDataForm(changes['enterprise'].currentValue);
    }
  }

  createDataForm() {
    this.dataForm = new FormGroup({
      id: new FormControl('', [
        Validators.required
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10)
      ])
    })
  }

  //Cargar la tabla
  setTable(id_enterprise: number) {
    this._api.postTypeRequest('profile/get-option2', { id_enterprise: id_enterprise }).subscribe( (value: any) => {
      console.log(value)
      if(value) {
        this.recharge = false;
        this.dataSource.data = value.data;
      } else {
        this.recharge = true;
      }
    })
  }

  //Setear los valores del formulario
  setDataForm(enterprise: Enterprise) {
    this.dataForm.setValue({
      id: (enterprise.id > 0)?enterprise.id:0,
      name: (enterprise.name_option2 != '')?enterprise.name_option2:'',
    })

  }

  toggleEdit() {
    this.edit = !this.edit;
    if(!this.edit) {
      this.setDataForm(this.enterprise);
    }
  }

  //Editar un valor
  editOption(id_option: number) {
    console.log(id_option)
  }

  //Recargar los datos
  rechargeData() {
    this.setTable(this.enterprise.id);
  }

  //Agregar nuevo valor
  addNewValue() {

  }

  //Mensaje de error
  getError() {
    if(this.dataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 2 caracteres';
    if(this.dataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 10 caracteres';
    return ''
  }

  onSubmit() {
    console.log(this.dataForm.value)
    this.loading =  true;
    this._api.postTypeRequest('profile/update-enterprise', this.dataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó datos empresa
            this._notify.showSuccess('Información actualizada con éxito!');
          } else{
            //No hubo modificación
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
          }
          setTimeout(() => {
            //this.rechargeComponent();
          }, 2000);
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error: any) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

}
