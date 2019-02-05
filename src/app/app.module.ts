import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatInputModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { AddUserDialogComponent } from './users/add-user.dialog/add-user.dialog.component';
import { IsAdminGuard, LoginService, IsLoggedInGuard } from './login/login.service';
import { ItemsComponent } from './items/items.component';
import { AddItemDialogComponent } from './items/add-item.dialog/add-item.dialog.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [IsLoggedInGuard] },
  { path: 'users', component: UsersComponent, canActivate: [IsAdminGuard] },
  { path: 'items', component: ItemsComponent, canActivate: [IsLoggedInGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UsersComponent,
    AddUserDialogComponent,
    ItemsComponent,
    AddItemDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [IsLoggedInGuard, IsAdminGuard, LoginService],
  bootstrap: [AppComponent],
  entryComponents: [AddUserDialogComponent, AddItemDialogComponent]
})
export class AppModule { }
