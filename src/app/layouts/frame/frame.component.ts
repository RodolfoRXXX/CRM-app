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
  isAuthenticated: boolean = false;
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
    this._auth.isLogged$.subscribe( state => this.isLoggin = state )
  }

  isUserAuthenticated() {
    this._auth.isAuthenticated$.subscribe( state => this.isAuthenticated = state )
  }

  setScreen(): void {
    this.breakpointObserver
        .observe(['(min-width: 768px)'])
        .subscribe((state: BreakpointState) => {
          state.matches?(this.screenLarge = true):(this.screenLarge = false);
        })
  }

}
