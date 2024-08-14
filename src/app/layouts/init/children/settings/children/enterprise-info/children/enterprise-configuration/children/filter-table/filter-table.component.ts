import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
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
  @Input() data!: any;
  @Output() update: EventEmitter<any> = new EventEmitter();

  dataForm!: FormGroup;
  loading: boolean = false;
  recharge: boolean = false;
  edit: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'edit'];
  dataSource = new MatTableDataSource();

  constructor(
    private _api: ApiService,
    private _notify: NotificationService,
    private _dialog: MatDialog
  ) {
    this.createDataForm();
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['enterprise'] && changes['data']) {
      //Aqui debe mostra algo por si no cargaron bien los datos de la empresa
      if(changes['data'].currentValue) {
        this.setDataForm();
        this.setTable();
        //acá debe cargar algo por si no hay datos
      }
    }
  }

//Nombre del campo
  //Muestra o no la ventana de edición de nombre del campo
  toggleEdit() {
    this.edit = !this.edit;
    if(this.edit) {
      this.setDataForm();
    }
  }
  //Crea el formulario para cambiar el nombre
  createDataForm() {
    this.dataForm = new FormGroup({
      id_enterprise: new FormControl('', [
        Validators.required
      ]),
      last_filter_name: new FormControl(''),
      filter_name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10)
      ]),
      filter_value: new FormControl('')
    })
  }
  //Setear los valores del formulario
  setDataForm() {
    this.dataForm.patchValue({
      id_enterprise: (this.enterprise.id > 0)?this.enterprise.id:0,
      last_filter_name: (this.data.filter_name)?this.data.filter_name:'',
      filter_name: (this.data.filter_name)?this.data.filter_name:''
    })
  }
  //Mensaje de error
  getError() {
    if(this.dataForm.controls['filter_name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['filter_name'].hasError('minlength')) return 'Este valor debe tener más de 2 caracteres';
    if(this.dataForm.controls['filter_name'].hasError('maxlength')) return 'Este valor debe tener menos de 10 caracteres';
    return ''
  }
  //Actualiza el nombre del filtro
  onSubmit() {
    this.loading =  true;
    this._api.postTypeRequest('profile/update-filter-name', this.dataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.affectedRows > 0){
            //Modificó datos empresa
            this._notify.showSuccess('Información actualizada con éxito!');
            setTimeout(() => {
              this.update.emit(true);
            }, 2000);
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

//Tabla de valores
  //Cargar la tabla de valores
  setTable() {
    this.dataSource.data = this.data.filter_values.split(',');
  }
  //Editar o crear un valor - abre el diálogo
  editOption(element: string) {
    const dialogRef = this._dialog.open(DialogEditClassificationComponent, { data: { id_enterprise: this.enterprise.id, filter_value: element, filter_name: this.data.filter_name } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        //que hace cuando la edición o creación de un nuevo se registro se realizó
        this.update.emit(true);
      }
    });
  }
  //Recargar los datos de la tabla
  rechargeData() {
    this.update.emit(true);
  }

}
