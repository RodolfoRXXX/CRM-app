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
  role!: any;
  list!: any;

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
    if(data.role.length) {
      this.list = JSON.parse(data.role)
      for(var key in this.list) {
        if(this.list[key]) {
          this.role = key;
          break;
        }
    }
    }
  }

  logOff(): void {
    this._router.navigate(['../logoff']);
  }

  logOffAll(): void {
    this._auth.setRememberOption(false);
    this._router.navigate(['../logoff']);
  }

}
