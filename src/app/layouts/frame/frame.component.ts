import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html'
})
export class FrameComponent implements OnInit, OnDestroy {

  isLogged!: boolean;
  isAuthenticated!: boolean;
  screenLarge!: boolean;
  openSidenav!: boolean;

  constructor(
    private _auth: AuthService,
    public breakpointObserver: BreakpointObserver,
    private _conector: ConectorsService
  ) {
    this.setScreen();
  }


  ngOnDestroy(): void {
    this._auth.isNotAuthenticated();
  }
  ngOnInit(): void {
    this.isUserLogged();
    this.isUserAuthenticated()
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
          this._conector.setScreenState(this.screenLarge);
          this._conector.setOpenedState(this.screenLarge);
          this.openSidenav = this.screenLarge;
        })
  }

  toggleSidenav() {
    this.openSidenav = !this.openSidenav;
    this._conector.setOpenedState(this.openSidenav);
  }

}
