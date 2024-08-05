import { Component } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private _conector: ConectorsService
  ) {}

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Tablero')
    this._conector.setUpdateSector('Tablero')
  }

}
