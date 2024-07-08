import { Component, Inject} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  standalone: true,
  selector: 'app-dialog-edit-classification',
  templateUrl: './dialog-edit-classification.component.html',
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DialogEditClassificationComponent {

  dataForm!: FormGroup;
  loading: boolean = false;
  is_new!: boolean;
  table!: string;

  constructor(
    public dialogRef: MatDialogRef<DialogEditClassificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    private _notify: NotificationService,
    private _auth: AuthService,
  ) {
    this.createDataForm();
    this.setDataUser();
    this.is_new = this.data.id_option == 0;
    this.table = this.data.table;
  }

  async getDataLocal(): Promise<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return data.id_enterprise;
  }

  setDataUser() {
    this.getDataLocal()
        .then( id_enterprise => {
          this.dataForm.patchValue({
            id: (this.data.id_option > 0)?this.data.id_option:'',
            id_enterprise: id_enterprise,
            name: (this.data.name != '')?this.data.name:''
          })
        })
  }

  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(''),
        id_enterprise: new FormControl('', [
          Validators.required
        ]),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15)
        ])
    });
  }

  getNameError() {
    //name
    if(this.dataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener al menos 1 caracter';
    if(this.dataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres'
    return ''
  }

  onSubmit() {
    this.loading = true;
    let uri;
    if(this.data.table == 'table_option_1') {
      uri = 'profile/update-enterprise-tableOption1';
    } else if(this.data.table == 'table_option_2') {
      uri = 'profile/update-enterprise-tableOption2';
    } else {
      this.closeDialog(false);
    }
    this._api.postTypeRequest(uri, this.dataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.affectedRows == 1){
            //Editó el valor
            this._notify.showSuccess('Tabla actualizada con éxito!');
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
