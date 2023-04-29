import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html'
})
export class FrameComponent implements OnInit, OnDestroy {

  isLogged: boolean = false;
  isAuthenticated: boolean = false;
  screenLarge: boolean = true;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    public breakpointObserver: BreakpointObserver
  ) { }


  ngOnDestroy(): void {
    this._auth.isNotAuthenticated();
  }
  ngOnInit(): void {
    this.isUserLogged();
    this.isUserAuthenticated()
    this.setScreen();
    this._auth.isActive()
  }

  isUserLogged() {
    this._auth.isLogged$.subscribe( state => this.isLogged = state )
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
