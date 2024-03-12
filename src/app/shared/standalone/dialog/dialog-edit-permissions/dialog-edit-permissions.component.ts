import { Component, Inject, OnInit, SimpleChange} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ConectorsService } from 'src/app/services/conectors.service';


@Component({
  standalone: true,
  selector: 'app-dialog-edit-permissions',
  templateUrl: './dialog-edit-permissions.component.html',
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
export class DialogEditPermissionsComponent implements OnInit {

  permissions = new MatTableDataSource();
  permissions_list: any;

  displayedColumns: string[] = ['permission', 'state'];
  role!: any;

  permissionForm!: FormGroup;
  loading_set_permission!: boolean;
  disable_submit!: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogEditPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data_role: any,
    private _api: ApiService,
    private _notify: NotificationService,
    private _conector: ConectorsService,
  ) {
    this.loading_set_permission = false;
    this.disable_submit = false;
    this.get_permissions();
    this.setPermissionsForm();
  }

  ngOnInit(): void {}

  get_permissions = () => {
    merge()
      .pipe(
        startWith({}),
        switchMap( () => {
          return this._api.getTypeRequest('profile/get-permissions')
                          .pipe(catchError(async () => {observableOf(null);}));
        } ),
        map( (data:any) => {
          this.permissions_list = data.data
        } ),
        switchMap( () => {
          return this._api.postTypeRequest('profile/get-enterprise-roles', { id_role: this.data_role.id_role })
                          .pipe(catchError(async () => {observableOf(null);}));
        } ),
        map( (data:any) => {
          if (data === null) {
            return [];
          }
          const arr_list = (data.data[0].list_of_permissions).split(',')
          this.permissions_list.forEach( (element:any) => {
            element.state = (arr_list.find( (value:any) => value == element.id ))?true:false;
            (this.permissionForm.get('list') as FormGroup).setControl(element.id, new FormControl(element.state))
          })
          return data
        } ),
      ).subscribe( () => this.permissions = this.permissions_list )
  }

  setPermissionsForm(): void {
    this.permissionForm = new FormGroup({
        id: new FormControl(this.data_role.id_role),
        icon_role: new FormControl(this.data_role.icon_role),
        name_role: new FormControl(this.data_role.role, [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        list: new FormGroup({}),
        list_of_permissions: new FormControl('')
    });
  }

  getError() {
    //name
    if(this.permissionForm.controls['name_role'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.permissionForm.controls['name_role'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.permissionForm.controls['name_role'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';

    return ''
  }

  submitPermissions() {
    this.disable_submit = true;
    this.loading_set_permission = true;
    let list: string = '';
    for (const element in this.permissionForm.get('list')?.value) {
      if(this.permissionForm.get('list')?.value[element]) {
        list += element.toString() + ','
      }
    }
    this.permissionForm.patchValue({
      list_of_permissions: list
    })

    this._api.postTypeRequest('profile/update-permissions', this.permissionForm.value).subscribe({
      next: (res: any) => {
        this.loading_set_permission =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó el usuario
            this._notify.showSuccess('Permisos actualizados con éxito!');
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.');
          }
          setTimeout(() => {
            this.closeDialog();
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
        this.loading_set_permission =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })  

  }

  closeDialog() {
    this.dialogRef.close();
  }

}
