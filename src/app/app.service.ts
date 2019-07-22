import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

import { User } from './models/user.model';
import { Item } from './models/item.model';
import { Group } from './models/group.model';

@Injectable()
export class AppService {
  
  constructor(private http: HttpClient) { }

  //#region users

  getAllUsers() {
    return this.http.get(environment.serverPath + '/api/user/getAllUsers');
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

  //#endregion

  //#region items

  getAllItems() {
    return this.http.get(environment.serverPath + '/api/item/getAllItems');
  }

  saveItem(item: Item) {
    return this.http.post(environment.serverPath + '/api/item/saveItem', {
      item: item
    });
  }

  editItem(item: Item) {
    return this.http.post(environment.serverPath + '/api/item/editItem', {
      item: item
    });
  }

  deleteItem(item: Item) {
    return this.http.post(environment.serverPath + '/api/item/deleteItem', {
      item: item
    });
  }

  //#endregion

  //#region groups
  getAllGroups() {
    return this.http.get(environment.serverPath + '/api/group/getAllGroups');
  }

  saveGroup(group: Group) {
    return this.http.post(environment.serverPath + '/api/group/saveGroup', {
      group: group
    });
  }

  editGroup(group: Group) {
    return this.http.post(environment.serverPath + '/api/group/editGroup', {
      group: group
    });
  }

  deleteGroup(group: Group) {
    return this.http.post(environment.serverPath + '/api/group/deleteGroup', {
      group: group
    });
  }

  //#endregion
  
}
