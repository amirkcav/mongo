import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import {/* FormsModule, ReactiveFormsModule,*/ FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

import { AppService } from '../../app.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-add-item.dialog',
  templateUrl: './add-item.dialog.component.html',
  styleUrls: ['./add-item.dialog.component.css']
})
export class AddItemDialogComponent implements OnInit {

  @Output() itemCreated = new EventEmitter<Item>();

  addItemForm: FormGroup;
  item: Item;
  confirmPassword: string;
  hidePasswords = true;

  constructor(private appService: AppService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.item = this.data ? this.data.item : new Item();
    this.addItemForm = new FormGroup({
      'name': new FormControl(this.item.name, [Validators.required]),
      'description': new FormControl(this.item.description),
      'price': new FormControl(this.item.price, [Validators.required]),
      'image': new FormControl(this.item.image),
      'imagePath': new FormControl()
    }, { validators: [  ] });
  }

  createItem() {
    const _item = Object.assign(new Item(), this.addItemForm.value);
    let func;
    // create item
    if (!this.data || !this.data.item._id) {
      func = this.appService.saveItem;
    }
    // edit item
    else {
      func = this.appService.editItem;
      _item._id = this.data.item._id;
    }
    func.call(this.appService, _item).toPromise().then((data) => {
      console.log(data);
      if (!_item._id) {
        _item._id = data.item._id;
      }
      this.itemCreated.emit(_item);
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
        this.addItemForm.get('image').setValue(reader.result);
      };
    }
  }

}
