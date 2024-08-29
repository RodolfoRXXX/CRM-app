import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditPermissionsComponent } from 'src/app/shared/standalone/dialog/dialog-edit-permissions/dialog-edit-permissions.component';
import { DialogCreateRoleComponent } from 'src/app/shared/standalone/dialog/dialog-create-role/dialog-create-role.component';
import { DialogViewProfileComponent } from 'src/app/shared/standalone/dialog/dialog-view-profile/dialog-view-profile.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  displayedColumns: string[] = ['user', 'email', 'role', 'verified', 'status', 'view'];
  dataSource = new MatTableDataSource();
  resultsLength: number = 0;
  load: boolean = true;
  recharge: boolean = false;
  source!: any;
  card_users!: any;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _conector: ConectorsService,
    public _dialog: MatDialog
  ) {
    this.getDataUsers();
    this.source = environment.SERVER;
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Roles y Permisos')
  }

  getDataLocal(): Promise<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return data.id_enterprise;
  }

  getDataUsers(): void {
    merge()
      .pipe(
        startWith({}),
        map(() => this.getDataLocal()),
        switchMap( (id_enterprise) => {
          this.recharge = false;
          this.load = true;
          return this._api.postTypeRequest('profile/get-enterprise-roles', { id_enterprise: id_enterprise })
                          .pipe(catchError(async () => {observableOf(null); this.recharge = true; }));
        } ),
        map( (roles:any) => {
          roles.data.forEach((element:any) => {
            element.user = []
          });
          this.card_users = roles.data
        } ),
        map(() => this.getDataLocal()),
        switchMap( (id_enterprise) => {
          return this._api.postTypeRequest('profile/get-enterprise-users', { id_enterprise: id_enterprise })
                          .pipe(catchError(async () => {observableOf(null); this.recharge = true; }));
        } ),
        map( (data:any) => {
          this.load = false;
          if (data === null) {
            return [];
          }
              //Completa el array que completa las cards
              data.data.filter( (value:any) => value.role != null).forEach((element:any) => {
                if(!this.card_users.find( (value:any) => value.name_role == element.role )) {
                  this.card_users.push({
                    'id_role'   : element.id_role,
                    'name_role' : element.role,
                    'icon_role' : element.icon_role,
                    'user'      : [element]
                  })
                } else {
                  (this.card_users[this.card_users.findIndex( (value:any) => value.name_role == element.role )].user).push(element)
                }
              });
          return data
        } ),
      ).subscribe( (data:any) => this.dataSource.data = data.data )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  rechargeData() {
    this.getDataUsers();
  }

  openView(id_user: number, id_employee: number, id_enterprise: number) {
    const dialogView = this._dialog.open(DialogViewProfileComponent, { data: { id_user: id_user, id_employee: id_employee, id_enterprise: id_enterprise }});
    dialogView.afterClosed().subscribe(result => {
      if(result) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  openEditRoleDialog(id_role: any, role:string, icon_role: string, task:string): void {
    const dialogRole = this._dialog.open(DialogEditPermissionsComponent, { data: { id_role: id_role, role: role, icon_role: icon_role, task: task }, disableClose: true});
    dialogRole.afterClosed().subscribe(result => {
      if(result) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

  openCreateRoleDialog() {
    const dialogCreate = this._dialog.open(DialogCreateRoleComponent, { disableClose: true  });

    dialogCreate.afterClosed().subscribe(result => {
      if(result) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }

}
