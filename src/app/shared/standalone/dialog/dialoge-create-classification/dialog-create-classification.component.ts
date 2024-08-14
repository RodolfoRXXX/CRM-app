import { Component, Inject} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  standalone: true,
  selector: 'app-dialog-create-classification',
  templateUrl: './dialog-create-classification.component.html',
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DialogCreateClassificationComponent {

  dataForm!: FormGroup;
  loading: boolean = false;
  is_new!: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateClassificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    private _notify: NotificationService
  ) {
    this.createDataForm();
    this.is_new = this.data.filter_value == '';
  }

  createDataForm(): void {
    this.dataForm = new FormGroup({
        id_enterprise: new FormControl((this.data.id_enterprise)?this.data.id_enterprise: '', [
          Validators.required
        ]),
        filter_name: new FormControl('', [
          Validators.required
        ]),
        filter_value: new FormControl('', [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15)
        ]),
        last_filter_name: new FormControl('')
    });
  }

  getNameError() {
    //value
    if(this.dataForm.controls['filter_name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['filter_name'].hasError('minlength')) return 'Este valor debe tener al menos 1 caracter';
    if(this.dataForm.controls['filter_name'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres'
    return ''
  }
  getValueError() {
    //value
    if(this.dataForm.controls['filter_value'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['filter_value'].hasError('minlength')) return 'Este valor debe tener al menos 1 caracter';
    if(this.dataForm.controls['filter_value'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres'
    return ''
  }

  onSubmit() {
    this.loading = true;
    this._api.postTypeRequest('profile/update-filter-name', this.dataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.affectedRows == 1){
            //Editó el valor
            this._notify.showSuccess('Nuevo filtro creado con éxito!');
          } else{
            //No hubo modificación
            this._notify.showError('No se ha podido actualizar la tabla');
          }
          setTimeout(() => {
            this.closeDialog(true);
          }, 2000);
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })
  }

  closeDialog(state: boolean) {
    this.dialogRef.close(state);
  }

}
