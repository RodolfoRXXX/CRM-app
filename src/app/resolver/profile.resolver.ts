import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolver  {

  constructor(
    private _auth: AuthService
  ) { }

  resolve(): Observable<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return data;
  }
}
