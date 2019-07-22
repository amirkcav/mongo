import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from '../app.service';
import { MatTable, MatDialogRef, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { Group } from '../models/group.model';
import { AddGroupDialogComponent } from './add-group.dialog/add-group.dialog.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  providers: [AppService, MatDialog]
})
export class GroupsComponent implements OnInit {

  @ViewChild('table') private groupsTable: MatTable<Group>;
  @ViewChild(MatSort) sort: MatSort;
  
  headers: string[];
  groups: Group[];
  dataSource: MatTableDataSource<any>;
  createGroupDialog: MatDialogRef<any>;
  
  constructor(private appService: AppService, public dialog: MatDialog) { }
  
  ngOnInit() {
    this.appService.getAllGroups().toPromise().then((data) => {
      if (data['status'] !== 'success') {
        alert(data['message']);
      }
      else {
        this.headers = [ 'image', 'name', 'actions' ];
        this.groups = data['data'];
        this.dataSource = new MatTableDataSource(this.groups);
        this.dataSource.sort = this.sort;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  createGroup(): void {
    this.createGroupDialog = this.dialog.open(AddGroupDialogComponent, {
      width: '400px',
    });
    this.createGroupDialog.componentInstance.groupCreated.subscribe((newUser) => {
      this.createGroupDialog.close();
      this.groups.push(newUser);
      this.dataSource.data = this.groups.slice();
      this.groupsTable.renderRows();
    });
  }

  delete(group: Group) {
    // console.log(`delete ${user.username} 1`);
    this.appService.deleteGroup(group).toPromise().then((data) => {
      if (data['status'] === 'success') {
        group['deleted'] = true;
        setTimeout(() => {
          const i = this.groups.indexOf(group);
          this.groups.splice(i, 1);
          this.dataSource.data = this.groups.slice();
          this.groupsTable.renderRows();
        }, 700);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  edit(group: Group) {
    this.createGroupDialog = this.dialog.open(AddGroupDialogComponent, {
      width: '400px',
      data: { group: group }
    });
    this.createGroupDialog.componentInstance.groupCreated.subscribe((newGroup) => {
      this.createGroupDialog.close();
      // add new user
      if (!group._id) {
        this.groups.push(newGroup);
      }
      // update user
      else {
        const _group = this.groups.filter((u) => u._id === group._id);
        const i = this.groups.indexOf(_group[0]);
        this.groups[i] = newGroup;        
      }
      this.dataSource.data = this.groups.slice();
      this.groupsTable.renderRows();
    });
  }

}
