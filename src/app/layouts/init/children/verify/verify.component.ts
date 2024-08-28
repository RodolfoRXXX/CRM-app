import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html'
})
export class VerifyComponent {

  verifyForm!: FormGroup;
  formMsg!: FormGroup;
  loading: boolean = false;
  load: boolean = false
  disable_submit!: boolean;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router,
    private _notify: NotificationService
  ) { 
    this.disable_submit = false;
   }

  ngOnInit(): void {
    this.createForm();
    this.createFormMsg();
    this.setDataUser();
  }

  async getDataUser(): Promise<any> {
    const data = await JSON.parse(this._auth.getDataFromLocalStorage());
    return data;
  }

  setDataUser() {
    this.getDataUser()
        .then( value => {
          this.verifyForm.patchValue({
            email: value.email
          });
          this.formMsg.patchValue({
            email: value.email,
            data: value.activation_code
          });
        })
  }

  createForm(): void {
    this.verifyForm = new FormGroup({
        email: new FormControl(''),
        activation_code: new FormControl('', [
          Validators.required,
          Validators.minLength(10)
        ])
    }
    );
  }

  createFormMsg() {
    this.formMsg = new FormGroup({
      email: new FormControl(''),
      data: new FormControl(''),
      tipo: new FormControl('code')
  });
  }

  getCodeErrorMessage() {
    if(this.verifyForm.controls['activation_code'].hasError('required')) {
      return 'Tenés que ingresar un código'}
    if(this.verifyForm.controls['activation_code'].hasError('minlength')) {
      return 'El código debe tener 10 caracteres'}
    return ''
  }

  onSubmit() {
    this.disable_submit = true;
    this.loading = true;
    this._api.postTypeRequest('profile/verificate-user', this.verifyForm.value).subscribe({
      next: (res: any) => {
        if(res.status == 1){
          //Accedió a la base de datos y verificó el usuario y el código de activación
          if(res.data.changedRows == 1){
            //Encontró el usuario
            this.loading =  false;
            this._notify.showSuccess('Cuenta verificada!');
            this._auth.setActiveState(true);
            this._auth.setState(1);
            setTimeout(() => {
              this._router.navigate(['init']);
            }, 2000);
          } else{
            //No encontró el usuario
            this.disable_submit = false;
            this.loading =  false;
            this._notify.showError('El código es incorrecto.')
          }
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })
  }

  sendCode() {
    this.load = true;
    this._api.postTypeRequest('user/envio-email', this.formMsg.value).subscribe({
      next: (res: any) => {
        this.load = false;
        if(res.status == 1){
          if(res.data == 'ok') {
            //envío de email exitoso!
            this._notify.showSuccess('Se envió un correo a tu cuenta con el código de verificación.');
          } else {
            //no se envío el email
            this._notify.showError('No se pudo enviar el correo con el código de verificación.');
          }
        } else{
          //no se envío el email
          this._notify.showError('No se pudo enviar el correo con el código de verificación.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.load = false;
        this._notify.showError('No se pudo enviar el correo con el código de verificación.');
      }
    });
  }

}
