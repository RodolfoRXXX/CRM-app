import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getUserDetails(){
    if (localStorage.getItem('userData')) {
      return localStorage.getItem('userData')
    } else {
      return null;
    }
  }

  getUserId(){
    if (localStorage.getItem('userId')) {
      return localStorage.getItem('userId')
    } else {
      return null;
    }
  }

  setDataInLocalStorage(variableName:any, data:any){
    localStorage.setItem(variableName, data);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  clearStorage(){
    localStorage.clear();
  }

}
