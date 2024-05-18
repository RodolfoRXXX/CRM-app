import { Component} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  standalone: true,
  selector: 'app-dialog-create-role',
  templateUrl: './dialog-create-role.component.html',
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DialogCreateRoleComponent {

  roleForm!: FormGroup;
  loading_create_role!: boolean;
  disable_submit!: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateRoleComponent>,
    private _api: ApiService,
    private _notify: NotificationService,
    private _auth: AuthService,
  ) {
    this.loading_create_role = false;
    this.disable_submit = false;
    this.setRoleForm();
    this.setDataUser();
  }

  async getDataLocal(): Promise<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return data.id_enterprise;
  }

  setDataUser() {
    this.getDataLocal()
        .then( id_enterprise => {
          this.roleForm.patchValue({
            id_enterprise: id_enterprise
          })
        })
  }

  setRoleForm(): void {
    this.roleForm = new FormGroup({
        id_enterprise: new FormControl(''),
        name_role: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        icon_role: new FormControl('', [
          Validators.required
        ])
    });
  }

  getNameError() {
    //name
    if(this.roleForm.controls['name_role'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.roleForm.controls['name_role'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.roleForm.controls['name_role'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres'
    return ''
  }
  getIconError() {
    //icon
    if(this.roleForm.controls['icon_role'].hasError('required')) return 'Elegí un ícono';
    return ''
  }

  createRole() {
    this.disable_submit = true;
    this.loading_create_role = true;
    this._api.postTypeRequest('profile/create-new-role', this.roleForm.value).subscribe({
      next: (res: any) => {
        this.loading_create_role =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.affectedRows == 1){
            //Creó el rol
            this._notify.showSuccess('Rol nuevo creado!');
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se ha podido crear el rol');
          }
          setTimeout(() => {
            this.closeDialog(true);
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
        this.loading_create_role =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })  
  }

  closeDialog(state: boolean) {
    this.dialogRef.close(state);
  }

}
