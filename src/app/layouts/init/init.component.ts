import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html'
})
export class InitComponent implements OnInit {

  opened: boolean = false;
  mode!: any;
  update!: boolean;
  title!: string;

  constructor(
    private _conector: ConectorsService,
    private cdRef:ChangeDetectorRef
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

  ngAfterViewChecked() {
    this._conector.getUpdateTitle().subscribe( title => {
      this.title = title;
    } )
    this.cdRef.detectChanges();
}

}
