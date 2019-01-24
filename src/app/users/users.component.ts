import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { User } from '../models/user.model';
import { MatDialog, MatDialogRef, MatTable } from '@angular/material';
import { AddUserDialogComponent } from './add-user.dialog/add-user.dialog.component';

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
      // data: {  }
    });
    this.createUserDialog.componentInstance.userCreated.subscribe((newUser) => {
      this.createUserDialog.close();
      this.users.push(newUser);
      this.usersTable.renderRows();
    });
  }

  delete(user: User) {
    this.appService.deleteUser(user).toPromise().then((data) => {
      if (data['status'] === 'success') {
        const i = this.users.indexOf(user);
        user['deleted'] = true;
        setTimeout(() => {
          this.users.splice(i, 1);
          this.usersTable.renderRows();
        }, 700);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

}
