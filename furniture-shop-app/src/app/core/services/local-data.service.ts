import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  constructor() { }

  saveData(key: string, value: any) {
    const newData = JSON.stringify(value);
    localStorage.setItem(key, newData);
  }

  getData(key: string) {
    const result = localStorage.getItem(key);
    if (result) {
      return JSON.parse(result);
    }
    return null;
  }
  removeData(key: string) {
    localStorage.removeItem(key);
  }

  clearData() {
    localStorage.clear();
  }
}
