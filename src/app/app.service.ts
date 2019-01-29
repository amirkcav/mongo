import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

import { User } from './models/user.model';

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

  saveUser(user: User) {
    return this.http.post(environment.serverPath + '/api/user/saveUser', {
      user: user
    });
  }

  editUser(user: User) {
    return this.http.post(environment.serverPath + '/api/user/editUser', {
      user: user
    });
  }

  deleteUser(user: User) {
    return this.http.post(environment.serverPath + '/api/user/deleteUser', {
      user: user
    });
  }

}
