import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee, empty_employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html'
})
export class InitComponent implements OnInit {

  opened: boolean = false;
  mode!: any;
  update!: boolean;
  title!: string;
  sector!: string;
  employee!: Employee;

  constructor(
    private _conector: ConectorsService,
    private cdRef:ChangeDetectorRef
  ) {
    
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
    });
    this._conector.getUpdateSector().subscribe( sector => {
      this.sector = sector;
    });
    this.cdRef.detectChanges();
  }

}
