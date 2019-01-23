import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get(environment.serverPath + '/get');
  }

  validateLogin(user: User) {
    return this.http.post(environment.serverPath + '/api/user/login', {
      username : user.username,
      password : user.password
    });
  }
}
