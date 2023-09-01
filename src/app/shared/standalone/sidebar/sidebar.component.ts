import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class SidebarComponent implements OnChanges {

  @Input() setMenu!: string;
  @Input() employee!: Employee;
  name!: string;
  pic!: string;
  enterprise!: string;
  expand!: string;
  roles!: any;
  is_employee!: boolean;

  constructor(
    public menuItems: MenuItems,
    private _auth: AuthService,
    private _router: Router,
    private _conector: ConectorsService
  ) {
    this.getDataUser();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes["employee"].currentValue.role) {
      this.roles = JSON.parse(changes["employee"].currentValue.role)
      for(var key in this.roles) {
        if(this.roles[key]) {
          this.expand = key;
          this.is_employee = true;
          break;
        }
      }
    }
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
    this._router.navigateByUrl(`init/${URI}`);
  }
  setTitle( title: string ) {
    this._conector.setUpdateTitle(title);
  }
  setSector( sector: string ) {
    this._conector.setUpdateSector(sector);
  }

}
