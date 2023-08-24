import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html'
})
export class InitComponent implements OnInit {

  opened: boolean = false;
  mode!: any;
  update!: boolean;
  title!: string;
  employee!: Employee;

  constructor(
    private _conector: ConectorsService,
    private cdRef:ChangeDetectorRef,
    private _actRoute: ActivatedRoute,
    private _auth: AuthService
  ) {
    this._conector.getOpenedState().subscribe( state => this.opened = state )
    this._conector.getScreenState().subscribe( state => state?this.mode = 'side':this.mode = 'over' )
  }

  ngOnInit(): void {
    this.employee = this._actRoute.snapshot.data['employee'].data[0];
    this._conector.setRole(this.employee.role);
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
