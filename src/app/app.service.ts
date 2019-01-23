import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';
import { environment } from '../environments/environment';

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(environment.serverPath + '/api/user/getAll');
  }

  validateLogin(user: User) {
    return this.http.post(environment.serverPath + '/api/user/login', {
      username : user.username,
      password : user.password
    });
  }

}
