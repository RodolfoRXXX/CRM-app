import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { Router, RouterModule } from '@angular/router';
import { MenuItems } from '../../menu-items/menu-items';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/enviroments/enviroment';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from '../../interfaces/employee.interface';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    RouterModule,
    MaterialModule,
    CommonModule
  ],
  providers: [
    MenuItems
  ]
})
export class SidebarComponent implements OnInit {

  @Input() setMenu!: string;
  @Input() employee!: Employee;
  name!: string;
  pic!: string;
  enterprise!: string;
  permissions: string[] = [];
  is_employee!: boolean;

  constructor(
    public menuItems: MenuItems,
    private _auth: AuthService,
    private _router: Router,
    private _conector: ConectorsService
  ) {
    this.getDataUser();
  }

  ngOnInit(): void {
    this._conector.getEmployee().subscribe( value => {
      //la lista de permisos se almacena como un string y luego se lo separa en un array
      //aunque el string de la DB esté vacío, el split devuelve un array con al menos un valor,
      //que es el valor vacío, por eso la desigualdad es mayor a 1
      this.permissions = value.list_of_permissions.split(',')
      this.is_employee = (value.id > 0)?true:false;
    })
  }

  getDataUser() {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    if(data.name.length) {
      this.name = data.name;
    }else {
      this.name = data.email.split("@")[0];
    }
    this.pic = environment.SERVER + data.thumbnail;
    if(data.enterprise.length) {
      this.enterprise = data.enterprise;
    } else {
      this.enterprise = '';
    } 
  }

  redirectTo( URI: string ) {
    //this._router.navigateByUrl(`init/main/${URI}`);
  }
  setTitle( title: string ) {
    this._conector.setUpdateTitle(title);
  }
  setSector( sector: string ) {
    this._conector.setUpdateSector(sector);
  }

}
