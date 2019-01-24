import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {/* FormsModule, ReactiveFormsModule,*/ FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-add-user.dialog',
  templateUrl: './add-user.dialog.component.html',
  styleUrls: ['./add-user.dialog.component.css']
})
export class AddUserDialogComponent implements OnInit {

  @Output() userCreated = new EventEmitter<User>();

  addUserForm: FormGroup;
  user = new User();
  confirmPassword: string;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.addUserForm = new FormGroup({
      'name': new FormControl(this.user.name),
      'username': new FormControl(this.user.username, [Validators.required]),
      'password': new FormControl(this.user.password, [Validators.required]),
      'confirmPassword': new FormControl(this.confirmPassword, [Validators.required]),
      'role': new FormControl(this.user.role, [Validators.required])
    }, { validators: [  ] });
  }

  createUser() {
    this.user = Object.assign(new User(), this.addUserForm.value);
    this.appService.saveUser(this.user).toPromise().then((data) => {
      console.log(data);
      this.userCreated.emit(this.user);
    })
    .catch((err) => {
      alert(err.error.error.errmsg);
    });
  }
}
