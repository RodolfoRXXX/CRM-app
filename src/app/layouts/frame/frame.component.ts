import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html'
})
export class FrameComponent implements OnInit {

  isLoggin: boolean = false;
  isInit: boolean = false;
  screenLarge: boolean = true;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    public breakpointObserver: BreakpointObserver
  ) {

  }
  ngOnInit(): void {
    this.isUserLogin();
    this.setScreen();
  }

  isUserLogin() {
    if (this._auth.getUserDetails() != null) {
      this.isLoggin = true;
      this._router.navigate(['recharge']);
    } else {
      this.isLoggin = false;
      this._router.navigate(['login']);
    }
  }

  setScreen(): void {
    this.breakpointObserver
        .observe(['(min-width: 768px)'])
        .subscribe((state: BreakpointState) => {
          state.matches?(this.screenLarge = true):(this.screenLarge = false);
        })
  }

}
