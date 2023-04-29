import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  hide = true;
  enterprises: Array<any> = [];

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _router: Router
  ) { 
    this.getEnterprises();
   }

  getEnterprises() {
    this._api.getTypeRequest(`enterprise`).subscribe({
      next: (res: any) => {
        if(res.length){
            this.enterprises = res;
        } else{
          //devuelve error
          console.log('array vacío')
        }
      },
      error: (error) => {
        //ventana de error
        console.log(error)
      }
    })
  }

}
