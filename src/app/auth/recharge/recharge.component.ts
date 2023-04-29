import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html'
})
export class RechargeComponent {

  hide = true;
  email!: string;
  pic!: string;
  rechargeForm!: FormGroup;
  
  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router
  ) {
    this.createForm();
    this.setDataUser();
  }

  createForm(): void {
    this.rechargeForm = new FormGroup({
      email : new FormControl(''),
      password : new FormControl(''),
      remember_me : new FormControl(true)
    });
  }

  onSubmit() {
    this._api.getTypeRequest(`user/?email=${this.rechargeForm.value.email}&password=${this.rechargeForm.value.password}`).subscribe({
      next: (res: any) => {
        if(res.length){
            this._auth.setDataInLocalStorage(res[0].id, "", res[0], this.rechargeForm.value.remember_me);
            this._router.navigate(['init']);
        } else{
          //devuelve error
          console.log('error de logueo')
        }
      },
      error: (error) => {
        //ventana de error
        console.log(error)
      }
    }) 
  }

  async getDataUser(): Promise<any> {
    const data = await JSON.parse(this._auth.getDataFromLocalStorage());
    return data;
  }

  setDataUser() {
    this.getDataUser()
        .then( value => {
          this.pic = value.thumbnail;
          this.email = value.email;
          this.rechargeForm.patchValue({
            email: value.email,
            password: value.password
          })
        })
  }

  logAllOut(): void {
    this._auth.clearAllStorage()?this._router.navigate(['login']):'';
  }

}
