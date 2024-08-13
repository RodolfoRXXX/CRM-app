import { Component, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';
import { DialogEditClassificationComponent } from 'src/app/shared/standalone/dialog/dialoge-edit-classification/dialog-edit-classification.component';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss']
})
export class FilterTableComponent {

  @Input() enterprise!: Enterprise;

  dataForm!: FormGroup;
  loading: boolean = false;
  recharge: boolean = false;
  edit: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'edit'];
  dataSource = new MatTableDataSource();

  constructor(
    private _api: ApiService,
    private _notify: NotificationService,
    private _dialog: MatDialog,
    private _auth: AuthService
  ) {
    this.createDataForm();
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['enterprise']) {
      console.log(changes['enterprise'].currentValue)
      this.setDataForm(changes['enterprise'].currentValue);
      if(changes['enterprise'].currentValue.name_option2) {
        this.setTable(changes['enterprise'].currentValue.id)
      }
    }
  }

//Nombre del campo
  //Muestra o no la ventana de edición de nombre del campo
  toggleEdit() {
    this.edit = !this.edit;
    if(this.edit) {
      this.setDataForm(this.enterprise);
    }
  }
  //Crea el formulario para cambiar el nombre
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
  //Setear los valores del formulario
  setDataForm(enterprise: Enterprise) {
    this.dataForm.patchValue({
      id: (enterprise.id > 0)?enterprise.id:0,
      name: (enterprise.name_option2 != '')?enterprise.name_option2:'',
    })
  }
  //Mensaje de error
  getError() {
    if(this.dataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 2 caracteres';
    if(this.dataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 10 caracteres';
    return ''
  }
  onSubmit() {
    this.loading =  true;
    this._api.postTypeRequest('profile/update-enterprise-option2', this.dataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó datos empresa
            this._notify.showSuccess('Información actualizada con éxito!');
            this._auth.setOptionName2(this.dataForm.get('name')?.value);
            setTimeout(() => {
              this.rechargeComponent();
            }, 1000);
          } else{
            //No hubo modificación
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
          }
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

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
  }

//Tabla de valores
  //Cargar la tabla de valores
  setTable(id_enterprise: number) {
    this._api.postTypeRequest('profile/get-option2', { id_enterprise: id_enterprise }).subscribe( (value: any) => {
      if(value) {
        this.recharge = false;
        this.dataSource.data = value.data;
      } else {
        this.recharge = true;
      }
    })
  }
  //Editar o crear un valor - abre el diálogo
  editOption(id_option: number, name: string, table: string) {
    const dialogRef = this._dialog.open(DialogEditClassificationComponent, { data: { id_option: id_option, name: name, table: table } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        //que hace cuando la edición o creación de un nuevo se registro se realizó
        this.setTable(this.enterprise.id);
      }
    });
  }
  //Recargar los datos de la tabla
  rechargeData() {
    this.setTable(this.enterprise.id);
  }

}
