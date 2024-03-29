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
  loading: boolean = false;
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
          })
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
            this._notify.showSuccess('Cuenta desbloqueada!');
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

}
