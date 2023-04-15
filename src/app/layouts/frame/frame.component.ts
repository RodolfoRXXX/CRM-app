import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html'
})
export class FrameComponent implements OnInit {

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) {

  }
  ngOnInit(): void {
    this.isUserLogin();
  }

  isUserLogin() {
    if (this._auth.getUserDetails() != null) {
      this._router.navigate(['recharge']);
    } else {
      this._router.navigate(['login']);
    }
  }

}
