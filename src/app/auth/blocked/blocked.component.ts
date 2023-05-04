import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-blocked',
  templateUrl: './blocked.component.html'
})
export class BlockedComponent implements OnInit {

  blockedForm!: FormGroup;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router
  ) { }

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
          this.blockedForm.patchValue({
            email: value.email
          })
        })
  }

  createForm(): void {
    this.blockedForm = new FormGroup({
        email: new FormControl(''),
        code: new FormControl('', [
          Validators.required,
          Validators.minLength(10)
        ])
    }
    );
  }

  getCodeErrorMessage() {
    if(this.blockedForm.controls['code'].hasError('required')) {
      return 'Tenés que ingresar un código'}
    if(this.blockedForm.controls['code'].hasError('minlength')) {
      return 'El código debe tener 10 caracteres'}
    return ''
  }

  onSubmit() {
    this._api.getTypeRequest(`user/?email=${this.blockedForm.value.email}&code=${this.blockedForm.value.code}`).subscribe({
      next: (res: any) => {
        if(res.length) {
          this._api.patchTypeRequest(`user/${res[0].id}`, { state: 'active' }).subscribe({
            next: (res:any) => {
              if(res){
                this._auth.setActiveState(true);
              }else {
                console.log("Sin activación");
              }
            },
            error: (error) => {
              //Ventana de error de cambio
              console.log('Error del patch:' + error)
            },
            complete: () => {
              this._router.navigate(['init']);
            }
          })
        }else {
          //ventana de error
          console.log('No se ha podido encontrar la cuenta a modificar');
        }
      },
      error: (error) => {
        //ventana de error
        console.log('Error del get:' + error)
      }
    })
  }

}
