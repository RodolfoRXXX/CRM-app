
import { DOCUMENT } from '@angular/common';
import { Component,Inject,Input,OnDestroy,ViewEncapsulation } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="preloader" *ngIf="isSpinnerVisible">
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {

  public isSpinnerVisible = true;

  @Input() public backgroundColor = 'rgba(0, 105, 92, 0.69)';

  constructor(
    private router: Router,
    private _auth: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.subscribe(
      event => {
        this._auth.isLogged();
        this._auth.isAuthenticated();
        this._auth.isActive();
        if(event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if(
          event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError
        ) {
          this.isSpinnerVisible = false;
        }
      },
      () => {
        this.isSpinnerVisible = false;
      }
    )
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
    throw new Error('Method not implemented.');
  }

}
