import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {/* FormsModule, ReactiveFormsModule,*/ FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

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
  user: User;
  confirmPassword: string;

  constructor(private appService: AppService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.user = this.data ? this.data.user : new User();
    this.addUserForm = new FormGroup({
      'name': new FormControl(this.user.name),
      'username': new FormControl(this.user.username, [Validators.required]),
      'password': new FormControl(this.user.password, [Validators.required]),
      'confirmPassword': new FormControl(this.user.password, [Validators.required]),
      'role': new FormControl(this.user.role, [Validators.required])
    }, { validators: [  ] });
  }

  createUser() {
    const _user = Object.assign(new User(), this.addUserForm.value);
    let func;
    // create user
    if (!this.data || !this.data.user._id) {
      func = this.appService.saveUser;
    }
    // edit user
    else {
      func = this.appService.editUser;
      _user._id = this.data.user._id;
    }
    func.call(this.appService, _user).toPromise().then((data) => {
      console.log(data);
      if (!_user._id) {
        _user._id = data.user._id;
      }
      this.userCreated.emit(_user /*data.user*/);
    })
    .catch((err) => {
      alert(err.error.error.errmsg);
    });
  }
}
