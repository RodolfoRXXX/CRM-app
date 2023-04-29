import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header-recharge',
  templateUrl: './header-recharge.component.html'
})
export class HeaderRechargeComponent {

  @Input() screenLarge!: boolean;
  @Input() isAuthenticated!: boolean;
  @Input() isLogged!: boolean;

  name!: string;
  pic!: string;
  role!: string;

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {
    this.getDataUser();
  }

  getDataUser() {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    if(data.name.length) {
      this.name = data.name;
    }else {
      this.name = data.email.split("@")[0];
    }
    this.pic = data.thumbnail;
    this.role = data.role.main;
  }

  logOut(): void {
    (this._auth.clearStorage())?this._router.navigate(['login']):this._router.navigate(['recharge']);
  }

  logAllOut(): void {
    this._auth.clearAllStorage()?this._router.navigate(['login']):'';
  }

}
