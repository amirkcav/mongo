import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from '../app.service';
import { MatTable, MatDialogRef, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
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
  @ViewChild(MatSort) sort: MatSort;
  
  headers: string[];
  items: Item[];
  dataSource: MatTableDataSource<any>;
  createItemDialog: MatDialogRef<any>;
  
  constructor(private appService: AppService, public dialog: MatDialog) { }
  
  ngOnInit() {
    this.appService.getAllItems().toPromise().then((data) => {
      if (data['status'] !== 'success') {
        alert(data['message']);
      }
      else {
        this.headers = [ 'image', 'name', 'price', 'actions' ];
        this.items = data['data'];
        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.sort = this.sort;
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
      this.dataSource.data = this.items.slice();
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
          this.dataSource.data = this.items.slice();
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
    this.createItemDialog.componentInstance.itemCreated.subscribe((newItem) => {
      this.createItemDialog.close();
      // add new user
      if (!item._id) {
        this.items.push(newItem);
      }
      // update user
      else {
        const _item = this.items.filter((u) => u._id === item._id);
        const i = this.items.indexOf(_item[0]);
        this.items[i] = newItem;        
      }
      this.dataSource.data = this.items.slice();
      this.itemsTable.renderRows();
    });
  }

}
