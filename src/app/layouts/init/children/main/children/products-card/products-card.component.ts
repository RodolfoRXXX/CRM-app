import { Component, OnInit } from '@angular/core';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-products-card',
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.scss'
})
export class ProductsCardComponent implements OnInit {

  employee!: Employee;
  range: string = '1M';
  text_range: string = 'Último mes'
  results!: any;

  constructor(
    private _api: ApiService,
    private _conector: ConectorsService,
  ) { }

  ngOnInit() {
    this.getInfo();
  }

  private getDataLocal(): number {
    let id_enterprise: number = 0;
    this._conector.getEmployee().subscribe((item: Employee) => {
      this.employee = item;
      id_enterprise = item.id_enterprise;
    });
    return id_enterprise;
  }

  private getInfo(id_enterprise?: number): void {
    merge()
      .pipe(
        startWith({}),
        map(() => id_enterprise ? id_enterprise : this.getDataLocal()),
        switchMap(id_enterprise => {
          return this._api.postTypeRequest('profile/get-data-best-product', { id_enterprise, range: this.range })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        if (data) {
          this.results = data.data
        }
      });
  }

  //Función que toma el rango de los datos
  setRange(range: string) {
    this.range = range;
    this.getInfo();
    switch (range) {
      case '1M':
        this.text_range = 'Último Mes' 
        break;
      case '6M':
        this.text_range = 'Últimos 6 meses' 
        break;
      case '12M':
        this.text_range = 'Último Año' 
        break;
      default:
        this.text_range = 'Último mes' 
        break;
    }
  }

}
