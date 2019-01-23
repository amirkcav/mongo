import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ AppService ]
})
export class LoginComponent {

  public user: User;

  constructor(private appService: AppService, private router: Router) {
    this.user = new User();
  }

  validateLogin() {
    if (this.user.username && this.user.password) {
      this.appService.validateLogin(this.user).subscribe(result => {
        console.log('result is ', result);
        if (result['status'] === 'success') {
          this.router.navigate(['/users']);
        } else {
          alert('Wrong username password');
        }
      }, error => {
        console.log('error is ', error);
      });
    } else {
      alert('enter user name and password');
    }
  }
}
