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

  //Consulta si el estado de los observables Behavior
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
        const state = localStorage.getItem('state');
        if((state) && (JSON.parse(state) == '1')){
          this.setActiveState(true);
          return true;
        }
        this.setActiveState(false);
        return false;
      }

  //Setea los valores de los observables Behavior
      //Setea el estado del observable isLogged$
      setLoggedState(state: boolean) {
        this._isLogged.next(state);
      }

      //Setea el estado del observable isAuthenticated$
      setAuthenticatedState(state: boolean) {
        this._isAuthenticated.next(state);
      }

      //Setea el estado del observable isActive$
      setActiveState(state: boolean) {
        this._isActive.next(state);
      }

  isNotAuthenticated() {
    this.setAuthenticatedState(false);
  }

  //Guarda las credenciales de acceso en el localstorage y actualiza los observables de logged y authenticated
  setDataInLocalStorage(id: number, token: any, state:any, data:any, remember:boolean): void {
    localStorage.setItem('userData', JSON.stringify(data));
    this.setState(state);
    this.setIdUserToLocalStorage(id);
    this.setToken(token);
    this.setRememberOption(remember);
    this.setLoggedState(true);
    this.setAuthenticatedState(true);
    //this.isActive();
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

  //Guardo el state activo o no de la cuenta
  setState(state: any): void {
    localStorage.setItem('state', JSON.stringify(state));
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
    if(this.getRememberOption()){
      this.setAuthenticatedState(false);
      localStorage.removeItem('token')
      return false;
    }else {
      this.setLoggedState(false);
      this.setAuthenticatedState(false);
      localStorage.clear();
      return true;
    }
  }

}
