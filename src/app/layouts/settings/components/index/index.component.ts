import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html'
})
export class IndexComponent {

  admin: boolean = false;

  constructor(
    private _auth: AuthService
  ) {
    this.getDataUser();
  }

  getDataUser() {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    if(JSON.parse(data.role)['gestión']) {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }

}
