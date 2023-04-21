import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, isEmpty, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  //Verifica si el usuario está logueado
  isLoggin() {
    if(localStorage.getItem("userData") !== null) this.isAuthenticated$.next(true);
  }

  //Guarda las credenciales de acceso en el localstorage y actualiza el observable
  setDataInLocalStorage(id: number, token: any, data:any): void {
    localStorage.setItem("userData", data);
    this.setIdUserToLocalStorage(id);
    this.setToken(token);
    this.isAuthenticated$.next(true);
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
    this.isAuthenticated$.next(false);
  }

}
