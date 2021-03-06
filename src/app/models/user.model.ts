export class User {
  constructor(username = '') {
    this.image = '';
    this.username = '';
    this.password = '';
    this.name = '';
    this.role = Roles.regularUser;
  }
  public _id: any;
  public name: string;
  public username: string;
  public password: string;
  public role: Roles;
  public image: any;
}

export enum Roles {
  regularUser,
  admin
}
