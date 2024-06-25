import { Component, OnInit } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-provider',
  template: '<router-outlet></router-outlet>'
})
export class ProviderComponent implements OnInit {

  sector!: string;

  constructor(
    private _conector: ConectorsService
  ) {

  }
  
  ngOnInit(): void {
    //Actualiza el título de la vista de acuerdo al componente cargado
    this._conector.setUpdateSector('Proveedores');
  }

}
