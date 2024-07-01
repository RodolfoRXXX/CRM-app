import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseInfoResolver  {

  constructor(
    private _api: ApiService,
    private _auth: AuthService
  ) { }

  resolve(): Observable<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return this._api.postTypeRequest('profile/get-enterprise', { id: data.id_enterprise })
  }
}
