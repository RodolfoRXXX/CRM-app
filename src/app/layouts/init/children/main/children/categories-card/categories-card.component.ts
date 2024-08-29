import { Component, OnInit } from '@angular/core';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-categories-card',
  templateUrl: './categories-card.component.html',
  styleUrls: ['./categories-card.component.scss']
})
export class CategoriesCardComponent implements OnInit {

  basicOptions: any;
  employee!: Employee;
  info!: number | null;
  basicData: { labels: string[], datasets: { label: string, data: number[], backgroundColor: string[], borderColor: string[], borderWidth: number }[] } = {
    labels: [],
    datasets: [{
      label: "Valor del stock",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 2
    }]
  };
  load: boolean = true;
  noData: boolean = false;

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
    this.load = true;
    this.load = false;
    merge()
      .pipe(
        startWith({}),
        map(() => id_enterprise ? id_enterprise : this.getDataLocal()),
        switchMap(id_enterprise => {
          return this._api.postTypeRequest('profile/get-categories-stock-price', { id_enterprise })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        this.load = false;
        let i = 0;
        if (data.status == 1 && data.data.length) {
          data.data.forEach((element: any) => {
            element.color_badge = JSON.parse(element.color_badge)
            if(element.total_stock_real > 0) {
              i++;
            }
          });
          if(i > 0) {
            this.initializeChartOptions();
            this.initializeChartData(data.data);
          } else {
            this.noData = true;
          }
        } else {
          this.noData = true;
        }
      });
  }

  // Inicializadores de la tabla
  initializeChartData(data: any) {

    this.basicData.labels = [];
    this.basicData.datasets[0].data = [];
    this.basicData.datasets[0].backgroundColor = [];
    this.basicData.datasets[0].borderColor = [];

    if (data) {
      data.forEach((item: any, index: number) => {
        this.basicData.labels.push(item.name);
        this.basicData.datasets[0].data.push(item.total_sale_price);
        this.basicData.datasets[0].backgroundColor.push(item.color_badge.bgColor);
        this.basicData.datasets[0].borderColor.push(item.color_badge.color);
      });
    }

    this.basicData.datasets[0].borderWidth = 2;
  }

  initializeChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.basicOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };
  }

}

