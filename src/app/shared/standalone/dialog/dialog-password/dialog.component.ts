import { Component, Inject, OnInit} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DialogComponent implements OnInit {

  checkPassword!: FormGroup;
  hide!: boolean;
  color!: string;
  icon!: string;
  btn_verify_pass!: boolean;
  loading_check_password!: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router
  ) {
    this.hide = true;
    this.color = 'primary';
    this.icon = 'search';
    this.btn_verify_pass = false;
    this.loading_check_password = false;
    this.checkPasswordForm();
    this.getDataUser();
  }

  ngOnInit(): void {}

  getDataUser() {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
        this.checkPassword.patchValue({
          id: data.id
        });
  }

  hidePassword(ev: any): void {
    ev.preventDefault();
    this.hide = !this.hide;
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

  getPasswordCheckErrorMessage() {
    if(this.checkPassword.controls['password'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    if(this.checkPassword.controls['password'].hasError('minlength')) {
      return 'Este valor debe tener más de 4 caracteres'}
    if(this.checkPassword.controls['password'].hasError('maxlength')) {
      return 'Este valor debe tener menos de 10 caracteres'}
    return ''
  }

  onSubmitChecker() {
    if(!this.checkPassword.get('password')!.disabled) {
      if(this.checkPassword.controls['password'].value.length > 3 && this.checkPassword.controls['password'].value.length < 11) {
        this.loading_check_password = true;
        this.btn_verify_pass = true;
        this._api.postTypeRequest('profile/verificate-password', this.checkPassword.value).subscribe({
          next: (res: any) => {
            if(res.status == 1){
              if(res.data.length) {
                //Verificó la contraseña
                this.loading_check_password = false;
                this.btn_verify_pass = false;
                this.icon = 'check';
                this.color = 'accent';
                this.dialogRef.close();
              } else {
                //No verificó la contraseña
                this.loading_check_password = false;
                this.btn_verify_pass = false;
                this.icon = 'close';
                this.color = 'warn';
              }
            } else{
              //Problemas de conexión con la base de datos(res.status == 0)
              this.loading_check_password = false;
              this.btn_verify_pass = false;
            }
          },
          error: (error) => {
            //Error de conexión, no pudo consultar con la base de datos
            this.loading_check_password = false;
            this.btn_verify_pass = false;
          }
        })
      }
    }  
  }

  closeDialog() {
    this.dialogRef.close();
    this._router.navigate(['../init/settings/index'])
  }

}


