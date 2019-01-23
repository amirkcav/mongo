import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [AppService]
})
export class UsersComponent implements OnInit {

  headers: string[];
  users: User[];

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.getAll().toPromise().then((data) => {
      if (data['status'] !== 'success') {
        alert(data['message']);
      }
      else {
        this.headers = Object.keys(new User());
        this.users = data['data'];
      }
    }).catch((error) => {
      console.error(error);
    });
  }

}
