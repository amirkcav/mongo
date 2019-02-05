import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { MatTable, MatDialogRef, MatDialog } from '@angular/material';
import { Item } from '../models/item.model';
import { AddItemDialogComponent } from './add-item.dialog/add-item.dialog.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers: [AppService, MatDialog]
})
export class ItemsComponent implements OnInit {

  @ViewChild('table') private itemsTable: MatTable<Item>;

  headers: string[];
  items: Item[];
  createItemDialog: MatDialogRef<any>;

  constructor(private appService: AppService, public dialog: MatDialog) { }

  ngOnInit() {
    this.appService.getAllItems().toPromise().then((data) => {
      if (data['status'] !== 'success') {
        alert(data['message']);
      }
      else {
        // this.headers = Object.keys(new Item()).filter((k) => k.indexOf('password') < 0);
        // this.headers.push('actions');
        this.headers = [ 'image', 'name', 'price', 'actions' ];
        this.items = data['data'];
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  createItem(): void {
    this.createItemDialog = this.dialog.open(AddItemDialogComponent, {
      width: '400px',
    });
    this.createItemDialog.componentInstance.itemCreated.subscribe((newUser) => {
      this.createItemDialog.close();
      this.items.push(newUser);
      this.itemsTable.renderRows();
    });
  }

  delete(item: Item) {
    // console.log(`delete ${user.username} 1`);
    this.appService.deleteItem(item).toPromise().then((data) => {
      if (data['status'] === 'success') {
        item['deleted'] = true;
        setTimeout(() => {
          const i = this.items.indexOf(item);
          this.items.splice(i, 1);
          this.itemsTable.renderRows();
        }, 700);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  edit(item: Item) {
    this.createItemDialog = this.dialog.open(AddItemDialogComponent, {
      width: '400px',
      data: { item: item }
    });
    this.createItemDialog.componentInstance.itemCreated.subscribe((newUser) => {
      this.createItemDialog.close();
      // add new user
      if (!item._id) {
        this.items.push(newUser);
      }
      // update user
      else {
        const _user = this.items.filter((u) => u._id === item._id);
        const i = this.items.indexOf(_user[0]);
        this.items[i] = newUser;
      }
      this.itemsTable.renderRows();
    });
  }

}
