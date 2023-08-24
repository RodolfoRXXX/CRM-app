import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitResolver implements Resolve<any> {

  constructor(
    private _api: ApiService,
    private _auth: AuthService
  ) { }

  resolve(): Observable<any> {
    const id = this._auth.getUserId();
    return this._api.postTypeRequest('profile/get-employee', { id_user: id })
  }
}
