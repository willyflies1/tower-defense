import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionUtilityService {

  constructor() { }

  public getAccessToken(){
    return sessionStorage.getItem('accessToken');
  }

  public setAccessToken(token: string){
    sessionStorage.setItem('accessToken', token);
  }

  public getRefreshToken(){
    return sessionStorage.getItem('refreshToken');
  }

  public setRefreshToken(token: string){
    sessionStorage.setItem('refreshToken', token);
  }

  public signOut(){
    sessionStorage.clear();
  }
}
