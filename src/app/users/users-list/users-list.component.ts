import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { User, Role } from '../../auth/user';
import { AuthService } from '../../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash-es';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  users: User[] = [];
  assignableRoles: Role[] = [];

  constructor(private userService: UserService, private authService: AuthService, public matSnackBar: MatSnackBar) {

    const roles = Object.values(Role);
    const idxOfRole = roles.indexOf(this.authService.user.role);
    this.assignableRoles = roles.slice(0, idxOfRole);
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  canEdit(userToEdit: User): boolean {
    const roles =  Object.values(Role);
    const idxCurrentRole = roles.indexOf(this.authService.user.role);
    const idxRoleToEdit = roles.indexOf(userToEdit.role);
    return idxCurrentRole > idxRoleToEdit;
  }

  onRowRemoving(e) {
    e.cancel = true;
    this.userService
      .deleteUser(e.data.id)
      .subscribe(
        () => {
          _.remove(this.users, u => u.id === e.data.id);
          this.matSnackBar.open('User deleted', 'OK', { duration: 3000, panelClass: 'toast-primary' });
        },
        err => {
          this.matSnackBar.open(err.error.message, 'OK', { duration: 3000, panelClass: 'toast-warn' });
        });
  }

  onRowUpdating(e) {
    e.cancel = true;
    const updatedUser = { ...e.oldData, ...e.newData };
    this.userService
      .updateUser(updatedUser)
      .subscribe(
        () => {
          this.dataGrid.instance.cancelEditData();
          Object.assign(this.users.find(u => u.id === updatedUser.id), updatedUser);
          this.matSnackBar.open('User updated', 'OK', { duration: 3000, panelClass: 'toast-primary' });
        },
        err => {
          this.matSnackBar.open(err.error.message, 'OK', { duration: 3000, panelClass: 'toast-warn' });
        });
  }

  onRowInserting(e) {
    e.cancel = true;
    this.userService
      .createUser(e.data)
      .subscribe(
        user => {
          this.dataGrid.instance.cancelEditData();
          this.users.push(user);
          this.matSnackBar.open('User created', 'OK', { duration: 3000, panelClass: 'toast-primary' });
        },
        err => {
          this.matSnackBar.open(err.error.message, 'OK', { duration: 3000, panelClass: 'toast-warn' });
        });
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.command === 'edit' && !e.row.inserted) {
      if (!this.canEdit(e.data)) {
        this.emptyChildren(e.cellElement);
      }
    }
  }

  emptyChildren(elt: HTMLElement) {
    for (let i = 0; elt.hasChildNodes(); i++) {
      elt.removeChild(elt.firstChild);
    }
  }
}
