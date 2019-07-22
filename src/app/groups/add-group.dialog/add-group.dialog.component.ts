import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {/* FormsModule, ReactiveFormsModule,*/ FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { AppService } from '../../app.service';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-add-group.dialog',
  templateUrl: './add-group.dialog.component.html',
  styleUrls: ['./add-group.dialog.component.css']
})
export class AddGroupDialogComponent implements OnInit {

  @Output() groupCreated = new EventEmitter<Group>();

  addGroupForm: FormGroup;
  group: Group;
  confirmPassword: string;
  hidePasswords = true;

  constructor(private appService: AppService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.group = this.data ? this.data.group : new Group();
    this.addGroupForm = new FormGroup({
      'name': new FormControl(this.group.name, [Validators.required]),
      'description': new FormControl(this.group.description),
      'image': new FormControl(this.group.image),
      'imagePath': new FormControl()
    }, { validators: [  ] });
  }

  createGroup() {
    const _group = Object.assign(new Group(), this.addGroupForm.value);
    let func;
    // create group
    if (!this.data || !this.data.group._id) {
      func = this.appService.saveGroup;
    }
    // edit group
    else {
      func = this.appService.editGroup;
      _group._id = this.data.group._id;
    }
    func.call(this.appService, _group).toPromise().then((data) => {
      console.log(data);
      if (!_group._id) {
        _group._id = data.group._id;
      }
      this.groupCreated.emit(_group);
    })
    .catch((err) => {
      alert(err.message);
    });
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.addGroupForm.get('image').setValue(reader.result);
      };
    }
  }

}
