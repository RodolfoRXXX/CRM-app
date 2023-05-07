import { Component } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent {

  opened: boolean = false;
  mode!: any;

  constructor(
    private _conector: ConectorsService
  ) {
    this._conector.getOpenedState().subscribe( state => this.opened = state )
    this._conector.getScreenState().subscribe( state => state?this.mode = 'side':this.mode = 'over' )
  }

}
