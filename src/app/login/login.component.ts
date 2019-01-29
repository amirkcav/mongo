import { Component } from '@angular/core';
// import { LoginService } from './login.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ AppService/*, LoginService*/ ]
})
export class LoginComponent {

  public user: User;

  constructor(private appService: AppService, private loginService: LoginService, private router: Router) {
    this.user = new User();
  }

  validateLogin() {
    if (this.user.username && this.user.password) {
      this.loginService.validateLogin(this.user).subscribe(result => {
        console.log('result is ', result);
        if (result['status'] === 'success') {
          if (result['data'][0].role === 'admin') {
            this.router.navigate(['/users']);
          }
          else {
            this.router.navigate(['/home']);
          }

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
