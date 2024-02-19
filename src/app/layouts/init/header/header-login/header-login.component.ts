import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-login',
  templateUrl: './header-login.component.html'
})
export class HeaderLoginComponent {

  @Input() screenLarge: boolean = true;

  constructor(
    private _router: Router
  ) { }

  goLogin() {
    this._router.navigate(['../login']);
  }

}
