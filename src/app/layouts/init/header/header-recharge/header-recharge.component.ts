import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-recharge',
  templateUrl: './header-recharge.component.html'
})
export class HeaderRechargeComponent implements OnInit {

  @Input() screenLarge!: boolean;
  @Input() isAuthenticated!: boolean;
  @Input() isLogged!: boolean;

  name!: string;
  pic!: string;
  role!: any;
  list!: any;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _conector: ConectorsService,
    private cdRef:ChangeDetectorRef,
  ) {
    this.getDataUser();
    this.role = '';
  }

  ngOnInit(): void {
    this._conector.getEmployee().subscribe( data => {
      if(data) {
        this.role = data.name_role;
      }
      this.cdRef.detectChanges();
    })
  }

  getDataUser() {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    if(data.name.length) {
      this.name = data.name;
    }else {
      this.name = data.email.split("@")[0];
    }
    this.pic = environment.SERVER + data.thumbnail;
  }

  logOff(): void {
    this._router.navigate(['../logoff']);
  }

  logOffAll(): void {
    this._auth.setRememberOption(false);
    this._router.navigate(['../logoff']);
  }

}
