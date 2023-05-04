import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logoff',
  templateUrl: './logoff.component.html'
})
export class LogoffComponent implements OnInit {

  constructor(
    private _router: Router,
    private _auth: AuthService
  ) { }
  ngOnInit(): void {
    this.redireccionar();
  }

  redireccionar() {
    setTimeout(() => {
    (this._auth.clearStorage())?this._router.navigate(['../login']):this._router.navigate(['../recharge']);
    }, 1500);
  }

}
