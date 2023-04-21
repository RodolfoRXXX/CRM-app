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
    this.isLoggin = this._auth.isAuthenticated$.getValue();
  }

  setScreen(): void {
    this.breakpointObserver
        .observe(['(min-width: 768px)'])
        .subscribe((state: BreakpointState) => {
          state.matches?(this.screenLarge = true):(this.screenLarge = false);
        })
  }

}
