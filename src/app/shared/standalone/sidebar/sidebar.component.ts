import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { Router, RouterModule } from '@angular/router';
import { MenuItems } from '../../menu-items/menu-items';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
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
  background_image!: string;
  pic!: string;
  enterprise!: string;
  permissions: string[] = [];
  is_employee!: boolean;
  isOpen!: number;
  linkActive!: number;
  isActive!: number;

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
    this.background_image = environment.SERVER + data.enterprise_thumbnail;
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

  //setLink() => Setea las variables isOpen y linkActive con un valor numérico,
  // este número es la ubicación en el arreglo de cada panel expansivo y de cada link que contiene cada panel expansivo
  //linkActive guarda el número de link activo, solo de paneles de links expandibles
  //isOpen guarda el número panel que está expandido
  //el condicional evalúa el link activo y si esta función fue llamada por un link no expandible, entonces valoriza isActive con 0
  // isActive es una variable numerica que guarda el número de panel expansible expandido, si queda 0 entonces el panel se retrae
  setLink(item: any) {
    this.linkActive = item
    this.isOpen = item;
    (item == 0)?this.isActive = 0:''
  }

  //_isLinkActive() => es una función llamada por un emisor de eventos((isActiveChange)="") que devuelve TRUE si el link está activo o FALSE en
  // caso contrario y también devuelve el número de link activo para así valorizar la variable linkActive que permitirá agregar la clase 
  // panelExpanded (que sombrea) al panel que tiene un link activo
  _isLinkActive(event:any, item:any) {
    event?this.linkActive = item:''
  }

}
