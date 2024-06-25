import { Component, OnInit } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-storage',
  template: '<router-outlet></router-outlet>'
})
export class StorageComponent implements OnInit {

  sector!: string;

  constructor(
    private _conector: ConectorsService
  ) {

  }

  ngOnInit(): void {
    //Actualiza el título de la vista de acuerdo al componente cargado
    this._conector.setUpdateSector('Depósito');
  }

}
