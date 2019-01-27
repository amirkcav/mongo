import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatTable } from '@angular/material';

import { AddUserDialogComponent } from './add-user.dialog/add-user.dialog.component';
import { User } from '../models/user.model';
import { AppService } from '../app.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [AppService, MatDialog]
})
export class UsersComponent implements OnInit {

  @ViewChild('table') private usersTable: MatTable<User>;

  headers: string[];
  users: User[];
  createUserDialog: MatDialogRef<any>;

  constructor(private appService: AppService, public dialog: MatDialog) { }

  ngOnInit() {
    this.appService.getAll().toPromise().then((data) => {
      if (data['status'] !== 'success') {
        alert(data['message']);
      }
      else {
        this.headers = Object.keys(new User()).filter((k) => k.indexOf('password') < 0);
        this.headers.push('actions');
        this.users = data['data'];
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  createUser(): void {
    this.createUserDialog = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
    });
    this.createUserDialog.componentInstance.userCreated.subscribe((newUser) => {
      this.createUserDialog.close();
      this.users.push(newUser);
      this.usersTable.renderRows();
    });
  }

  delete(user: User) {
    // console.log(`delete ${user.username} 1`);
    this.appService.deleteUser(user).toPromise().then((data) => {
      console.log(`delete ${user.username} 2`);
      if (data['status'] === 'success') {
        user['deleted'] = true;
        setTimeout(() => {
          const i = this.users.indexOf(user);
          this.users.splice(i, 1);
          this.usersTable.renderRows();
        }, 700);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  edit(user: User) {
    this.createUserDialog = this.dialog.open(AddUserDialogComponent, {
      width: '400px',
      data: { user: user /*, userId: user.id*/ }
    });
    this.createUserDialog.componentInstance.userCreated.subscribe((newUser) => {
      this.createUserDialog.close();
      // add new user
      if (!user._id) {
        this.users.push(newUser);
      }
      // update user
      else {
        const _user = this.users.filter((u) => u._id === user._id);
        const i = this.users.indexOf(_user[0]);
        this.users[i] = newUser;
      }
      this.usersTable.renderRows();
    });
  }

}
