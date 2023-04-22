import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Observable para usuario ya logueado pero no verificado
  private _isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isLogged$ : Observable<boolean> = this._isLogged.asObservable();

  //Observable para usuario ya logueado y verificado
  private _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isAuthenticated$ : Observable<boolean> = this._isAuthenticated.asObservable();

  //Cambia el estado del observable isLogged$ si hay data en el localStorage
  isLogged() {
    if(localStorage.getItem("userData") !== null) this._isLogged.next(true);
  }

  //Cambia el estado del observable isAuthenticated$ si las credenciales se verificaron
  isAuthenticated() {
    this._isAuthenticated.next(true);
  }

  //Guarda las credenciales de acceso en el localstorage y actualiza los observables de logged y authenticated
  setDataInLocalStorage(id: number, token: any, data:any): void {
    localStorage.setItem("userData", data);
    this.setIdUserToLocalStorage(id);
    this.setToken(token);
    this._isLogged.next(true);
    this._isAuthenticated.next(true);
  }

  //Devuelvo las credenciales de acceso
  getDataFromLocalStorage() {
    return localStorage.getItem('userData');
  }

  //Guardo el Id del usuario logueado
  setIdUserToLocalStorage(id: number): void {
    localStorage.setItem("userId", id.toString());
  }

  //Obtengo el userId del usuario logueado
  getUserId(){
    if (localStorage.getItem('userId')) {
      return localStorage.getItem('userId')
    } else {
      return null;
    }
  }

  //Guardo el token del usuario logueado
  setToken(token: any): void {
    localStorage.setItem("tokenId", token);
  }

  //Obtengo el token del usuario logueado
  getToken(){
    return localStorage.getItem('tokenId');
  }

  //Limpio toda la información del usuario logueado
  clearStorage(){
    localStorage.clear();
    this._isLogged.next(false);
    this._isAuthenticated.next(false);
  }

}
