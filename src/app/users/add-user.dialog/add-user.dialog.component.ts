import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {/* FormsModule, ReactiveFormsModule,*/ FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
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
  hidePasswords = true;

  constructor(private appService: AppService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.user = this.data ? this.data.user : new User();
    this.addUserForm = new FormGroup({
      'name': new FormControl(this.user.name),
      'username': new FormControl(this.user.username, [Validators.required]),
      'password': new FormControl(this.user.password, [Validators.required]),
      'confirmPassword': new FormControl(this.user.password, [Validators.required, this.confirmPasswordMatch]),
      'role': new FormControl(this.user.role, [Validators.required]),
      'image': new FormControl(this.user.image),
      'imagePath': new FormControl()
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
      this.userCreated.emit(_user);
    })
    .catch((err) => {
      alert(err.error.error.errmsg);
    });
  }

  confirmPasswordMatch(input: FormControl) {
    const password = input.parent ? input.parent.controls['password'].value : '';
    return password === input.value ? null : { confirmPasswordNotMatch: true };
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.addUserForm.get('image').setValue(reader.result);
        // this.addUserForm.get('image').setValue({
        //   filename: file.name,
        //   filetype: file.type,
        //   value: reader.result.split(',')[1],
        //   valuePrefix: reader.result.split(',')[0]
        // });
      };
    }
  }

}
