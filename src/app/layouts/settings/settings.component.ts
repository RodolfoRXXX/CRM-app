import { Component, OnInit } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {

  opened: boolean = false;
  mode!: any;
  update!: boolean;

  constructor(
    private _conector: ConectorsService
  ) {
    this._conector.getOpenedState().subscribe( state => this.opened = state )
    this._conector.getScreenState().subscribe( state => state?this.mode = 'side':this.mode = 'over' )
  }

  ngOnInit(): void {
    this._conector.getUpdate().subscribe( state => {
      if(this.update) {
        this.update = !this.update;
      } else {
        this.update = state;
      }
    } );
  }

}
