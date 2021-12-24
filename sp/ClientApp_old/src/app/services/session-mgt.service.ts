import { Injectable } from '@angular/core';
//import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from ;

@Injectable()
export class SessionMgtService {

  constructor() { }

  setSessionVar(key: string, val: string) {
    localStorage.setItem(key, val);
  }

  getSessionVal(key: string) {
    let val = localStorage.getItem('key');
    return val;
  }

  removeSessionVal(key: string) {
    return localStorage.removeItem(key);
  }

  clearSessionVal() {
    return localStorage.clear()
  }

}
