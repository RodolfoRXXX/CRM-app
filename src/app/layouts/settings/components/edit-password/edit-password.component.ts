import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html'
})
export class EditPasswordComponent implements OnInit {

  userDataForm!: FormGroup;
  checkPassword!: FormGroup;
  hide: boolean;
  hide_1: boolean;
  hide_2: boolean;
  formMsg!: FormGroup;
  color: string;
  icon: string;
  btn_verify_pass: boolean;
  loading: boolean;
  passwordFirst!: FormControl;
  disable_submit!: boolean;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router,
    private _notify: NotificationService
  ) {
    this.loading = false;
    this.color = 'primary';
    this.icon = 'search';
    this.btn_verify_pass = false;
    this.hide = true;
    this.hide_1 = true;
    this.hide_2 = true;
    this.disable_submit = false;
    this.passwordFirst = new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10)
    ]);
  }

  ngOnInit(): void {
    this.checkPasswordForm();
    this.createUserForm();
    this.creeateFormMsg();
    this.getDataUser();
    this.passwordFirst.valueChanges.subscribe( value => {
      if( ((this.userDataForm.value.password?.length > 3) && (this.userDataForm.value.password?.length < 11) ) && (value !== this.userDataForm.value.password)) {
        this.userDataForm.controls['password'].setErrors({ no_equal: true });
      }
    })
    this.userDataForm.controls['password'].valueChanges.subscribe( value => {
      if(value !== this.passwordFirst.value) {
        this.userDataForm.controls['password'].setErrors({ no_equal: true });
      }
    })
  }

  getDataUser() {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
      this.checkPassword.patchValue({
        id: data.id
      });
      this.userDataForm.patchValue({
        id: data.id
      })
      this.formMsg.patchValue({
        email: data.email
      })
  }

  hidePassword(ev: any): void {
    ev.preventDefault();
    this.hide = !this.hide;
  }
  hide1Password(ev: any): void {
    ev.preventDefault();
    this.hide_1 = !this.hide_1;
  }
  hide2Password(ev: any): void {
    ev.preventDefault();
    this.hide_2 = !this.hide_2;
  }

  clean_btn_verify() {
    this.btn_verify_pass = false;
    this.icon = 'search';
    this.color = 'primary';
  }

  checkPasswordForm(): void {
    this.checkPassword = new FormGroup({
        id: new FormControl(''),
        password : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ])
    });
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        id: new FormControl(''),
        password : new FormControl({ value: '', disabled: true }, [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10)
        ]),
    });
  }

  creeateFormMsg() {
    this.formMsg = new FormGroup({
      email: new FormControl(''),
      data: new FormControl(''),
      tipo: new FormControl('change_pass')
    });
  }

  getPasswordCheckErrorMessage() {
    if(this.checkPassword.controls['password'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.checkPassword.controls['password'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.checkPassword.controls['password'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 10 caracteres'}
    return ''
  }
  getPasswordErrorMessageFirst() {
    if(this.passwordFirst.hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.passwordFirst.hasError('minlength')) {
      return 'Min. 4 caracteres'}
    if(this.passwordFirst.hasError('maxlength')) {
      return 'Max. 10 caracteres'}
    return ''
  }
  getPasswordErrorMessage() {
    if(this.userDataForm.controls['password'].hasError('no_equal')) {
      return 'Las contraseñas no coinciden'}
    return ''
  }

  onSubmitChecker() {
    if(!this.checkPassword.get('password')!.disabled) {
      if(this.checkPassword.controls['password'].value.length > 3 && this.checkPassword.controls['password'].value.length < 11) {
        this.loading = true;
        this.btn_verify_pass = true;
        this._api.postTypeRequest('profile/verificate-password', this.checkPassword.value).subscribe({
          next: (res: any) => {
            if(res.status == 1){
              if(res.data.length) {
                //Verificó la contraseña
                this.loading = false;
                this.btn_verify_pass = false;
                this.icon = 'check';
                this.color = 'accent';
                this._notify.showSuccess('Contraseña verificada!');
                this.checkPassword.get('password')!.disable();
                this.passwordFirst?.enable();
                this.userDataForm.get('password')?.enable();
              } else {
                //No verificó la contraseña
                this.loading = false;
                this.btn_verify_pass = false;
                this.icon = 'close';
                this.color = 'warn';
                this._notify.showError('Contraseña NO verificada.');
              }
            } else{
              //Problemas de conexión con la base de datos(res.status == 0)
              this.loading = false;
              this.btn_verify_pass = false;
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
            }
          },
          error: (error) => {
            //Error de conexión, no pudo consultar con la base de datos
            this.loading = false;
            this.btn_verify_pass = false;
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
          }
        })
      }
    }  
  }

  onSubmitUser() {
    this.disable_submit = true;
    this.loading =  true;
    this._api.postTypeRequest('profile/update-password', this.userDataForm.value).subscribe({
      next: (res: any) => {
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó la contraseña
            this.loading =  false;
            this._notify.showSuccess('Contraseña actualizada!');
            this._auth.setRememberOption(false);
            setTimeout(() => {
              this._router.navigate(['../logoff']);
            }, 2000);
            this._api.postTypeRequest('user/envio-email', this.formMsg.value).subscribe();
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this.loading =  false;
            this._notify.showError('No se detectaron cambios. Ingresá una contraseña diferente al actual.')
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
