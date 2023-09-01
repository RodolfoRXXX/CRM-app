import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee, empty_employee } from '../shared/interfaces/employee.interface';

@Injectable({
  providedIn: 'root'
})
export class ConectorsService {

  //Observable para el sidenav de init y settings
  private _isOpened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isOpened$ : Observable<boolean> = this._isOpened.asObservable();

  //Observable para el largo de la pantalla
  private _screenLarge: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly screenLarge$ : Observable<boolean> = this._screenLarge.asObservable();

  //Observable para actualizar un componente hijo
  private _update: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly update$ : Observable<boolean> = this._update.asObservable();

  //Observable para actualizar el string de título de la barra superior de "init"
  private _updateTitle: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public readonly updateTitle$ : Observable<string> = this._updateTitle.asObservable();

  //Observable para actualizar el string final de la barra superior de "init"
  private _updateSector: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public readonly updateSector$ : Observable<string> = this._updateSector.asObservable();

  //Observable para actualizar el observable que contiene el objeto del empleado que accedió
  private _employee: BehaviorSubject<Employee> = new BehaviorSubject<Employee>(empty_employee);
  public readonly employee$ : Observable<Employee> = this._employee.asObservable();

  //GETTERS
    getOpenedState(): Observable<boolean> {
      return this.isOpened$;
    }
    getScreenState(): Observable<boolean> {
      return this.screenLarge$;
    }
    getUpdate(): Observable<boolean> {
      return this.update$;
    }
    getUpdateTitle(): Observable<string> {
      return this.updateTitle$;
    }
    getUpdateSector(): Observable<string> {
      return this.updateSector$;
    }
    getEmployee(): Observable<Employee> {
      return this.employee$;
    }


  //SETTERS
    setOpenedState(state: boolean) {
      this._isOpened.next(state);
    }
    setScreenState(state: boolean) {
      this._screenLarge.next(state);
    }
    setUpdate(state: boolean) {
      this._update.next(state);
    }
    setUpdateTitle(text: string) {
      this._updateTitle.next(text);
    }
    setUpdateSector(text: string) {
      this._updateSector.next(text);
    }
    setEmployee(employee: Employee) {
      this._employee.next(employee);
    }

}
