import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Observable para usuario logueado
  private _isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isLogged$ : Observable<boolean> = this._isLogged.asObservable();

  //Observable para usuario verificado
  private _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isAuthenticated$ : Observable<boolean> = this._isAuthenticated.asObservable();

  //Observable para usuario activo
  private _isActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isActive$ : Observable<boolean> = this._isActive.asObservable();

  //Cambia el estado del observable isLogged$ si hay data en el localStorage
  isLogged() {
    if(localStorage.getItem("userData") !== null) this._isLogged.next(true);
  }

  //Cambia el estado del observable isAuthenticated$ si las credenciales se verificaron
  isAuthenticated() {
    if(localStorage.getItem("token") !== null) this._isAuthenticated.next(true);
  }

  //Cambia el estado del observable isActive$ si el usuario está activo
  isActive(): boolean {
      const userData = localStorage.getItem('userData');
      if((userData) && (JSON.parse(userData).state === 'active')){
        this._isActive.next(true);
        return true;
      }
      this._isActive.next(false);
      return false;
  }

  isNotAuthenticated() {
    this._isAuthenticated.next(false);
  }

  //Guarda las credenciales de acceso en el localstorage y actualiza los observables de logged y authenticated
  setDataInLocalStorage(id: number, token: any, data:any, remember:boolean): void {
    localStorage.setItem("userData", JSON.stringify(data));
    this.setIdUserToLocalStorage(id);
    this.setToken(token);
    this.setRememberOption(remember);
    this._isLogged.next(true);
    this._isAuthenticated.next(true);
    this.isActive();
  }

  //Devuelvo las credenciales de acceso
  getDataFromLocalStorage(): any | null {
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
    localStorage.setItem("token", JSON.stringify(token));
  }

  //Obtengo el token del usuario logueado
  getToken(): any | null{
    return localStorage.getItem('token');
  }

  //Setea la variable rememberOption en el localStorage para saber si el usuario desea guardar sus datos para el próximo inicio de sesión
  setRememberOption(remember_me: boolean) {
    localStorage.setItem("rememberOption", remember_me.toString());
  }

  //Obtnener el valor de la variable rememberOption
  getRememberOption() {
    let remember_me = (localStorage.getItem('rememberOption') === 'true');
    return remember_me;
  }

  //Limpio toda la información del usuario logueado
  clearStorage(): boolean{
    this._isLogged.next(false);
    this._isAuthenticated.next(false);
    if(this.getRememberOption()){
      localStorage.removeItem('token')
      return false;
    }else {
      localStorage.clear();
      return true;
    }
  }

  clearAllStorage(): boolean {
    this._isLogged.next(false);
    this._isAuthenticated.next(false);
    localStorage.clear();
      return true;
  }

}
