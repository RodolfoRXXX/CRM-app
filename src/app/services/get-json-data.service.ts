import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetJsonDataService {

  constructor(
    private _http: HttpClient
  ) { }

  getData(fileName: string): Observable<any> {
    return this._http.get<any>(`assets/data/${fileName}`);
  }

}
