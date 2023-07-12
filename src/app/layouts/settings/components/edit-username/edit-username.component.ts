import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-edit-username',
  templateUrl: './edit-username.component.html'
})
export class EditUsernameComponent implements OnInit {

  userDataForm!: FormGroup;
  formMsg!: FormGroup;
  loading: boolean;
  act_name!: string;
  disable_submit!: boolean;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router,
    private _notify: NotificationService
  ) {
    this.loading = false;
    this.disable_submit = false;
  }

  ngOnInit(): void {
    this.createUserForm();
    this.creeateFormMsg();
    this.getDataUser();
  }

  getDataUser() {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
      if((data.name)&&(data.name.length)) {
        this.userDataForm.controls['name'].setValue(data.name);
        this.act_name = data.name
      } else {
        this.userDataForm.controls['name'].setValue(data.email.split("@")[0]);
        this.act_name = data.email.split("@")[0]
      }
      this.userDataForm.patchValue({
        id: data.id
      })
      this.formMsg.patchValue({
        email: data.email
      })
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        id: new FormControl(''),
        name : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(25)
        ])
    });
  }

  creeateFormMsg() {
    this.formMsg = new FormGroup({
      email: new FormControl(''),
      data: new FormControl(''),
      tipo: new FormControl('change_user')
    });
  }

  getUserNameErrorMessage() {
    if(this.userDataForm.controls['name'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.userDataForm.controls['name'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.userDataForm.controls['name'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 25 caracteres'}
    return ''
  }

  onSubmitUser() {
    this.disable_submit = true;
    this.loading =  true;
    this._api.postTypeRequest('profile/update-username', this.userDataForm.value).subscribe({
      next: (res: any) => {
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó el usuario
            this.loading =  false;
            this._notify.showSuccess('Nombre de usuario actualizado!');
            this._auth.setDataInLocalStorage(res.data[0].id, res.token, res.data[0].state, res.data[0], this._auth.getRememberOption());
            setTimeout(() => {
              window.location.reload();
            }, 2000);
            this._api.postTypeRequest('user/envio-email', this.formMsg.value).subscribe();
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this.loading =  false;
            this._notify.showError('No se detectaron cambios. Ingresá un nombre de usuario diferente al actual.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error) => {
        console.log(error)
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

}
