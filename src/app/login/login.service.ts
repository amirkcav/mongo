import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { CanActivate } from '@angular/router';

@Injectable()
export class LoginService {

  // isLoggedIn = false;
  // isAdmin = false;

  constructor(private http: HttpClient) { }

  validateLogin(user: User) {
    return this.http.post(environment.serverPath + '/api/user/login', {
      username : user.username,
      password : user.password
    })
    .map((res) => {  
      if (res['status'] === 'success') {
        // this.isLoggedIn = true;
        const role = res['data'][0].role;
        // this.isAdmin = role === 'admin';
        localStorage.setItem('mongoUser', JSON.stringify(res['data'][0]));
      }
      return res;
    });
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('mongoUser');
    return user !== null;
  }

  isAdmin() {
    const user = localStorage.getItem('mongoUser');
    return user !== null && JSON.parse(user)['role'] === 'admin';
  }

  logout() {
    // this.isLoggedIn = false;
    // this.isAdmin = false;  
    localStorage.removeItem('mongoUser');  
  }

}

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  constructor(private loginService: LoginService) { }

  canActivate() {
    return this.loginService.isLoggedIn();
  }
}

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private loginService: LoginService) { }
  
  canActivate() {
    return this.loginService.isAdmin();
  }
}
