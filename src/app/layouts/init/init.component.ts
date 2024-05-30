import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html'
})
export class InitComponent implements OnInit {

  isLogged!: boolean;
  isAuthenticated!: boolean;
  screenLarge!: boolean;
  openSidenav!: boolean;
  opened: boolean = false;
  mode!: any;
  update!: boolean;
  title!: string;
  sector!: string;
  employee!: Employee;

  constructor(
    private _conector: ConectorsService,
    private cdRef:ChangeDetectorRef,
    public breakpointObserver: BreakpointObserver,
    private _auth: AuthService
  ) {
    this.setScreen();
  }

  ngOnInit(): void {
    this.isUserLogged();
    this.isUserAuthenticated()
    this._auth.isActive();
    this._conector.getUpdate().subscribe( state => {
      if(this.update) {
        this.update = !this.update;
      } else {
        this.update = state;
      }
    } );
    
  }

  ngAfterViewChecked() {
    this._conector.getUpdateTitle().subscribe( title => {
      this.title = title;
    });
    this._conector.getUpdateSector().subscribe( sector => {
      this.sector = sector;
    });
    this.cdRef.detectChanges();
  }

  setScreen(): void {
    this.breakpointObserver
        .observe(['(min-width: 992px)'])
        .subscribe((state: BreakpointState) => {
          state.matches?(this.screenLarge = true):(this.screenLarge = false);
          this._conector.setScreenState(this.screenLarge);
          this._conector.setOpenedState(this.screenLarge);
          this.openSidenav = this.screenLarge;
        })
  }

  isUserLogged() {
    this._auth.isLogged$.subscribe( state => this.isLogged = state )
  }

  isUserAuthenticated() {
    this._auth.isAuthenticated$.subscribe( state => this.isAuthenticated = state )
  }

  toggleSidenav() {
    this.openSidenav = !this.openSidenav;
    this._conector.setOpenedState(this.openSidenav);
  }

  ngOnDestroy(): void {
    this._auth.isNotAuthenticated();
  }

}
