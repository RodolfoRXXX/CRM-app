import { Component, OnInit } from '@angular/core';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { formatDate, getMonthName, getWeekInfo } from 'src/app/shared/functions/date.function';
import { analyzeData } from 'src/app/shared/functions/operation.function';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { DataItem } from 'src/app/shared/interfaces/period.interface';
import { permissions } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.scss']
})
export class BalanceCardComponent implements OnInit {

  basicOptions: any;
  employee!: Employee;
  seller!: number | null;
  info!: number | null;
  range: string = 'day';
  basicData: { labels: string[], datasets: { label: string, data: number[], backgroundColor: string[], borderColor: string[], borderWidth: number }[] } = {
    labels: [],
    datasets: [{
      label: "Ventas Totales",
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 2
    }]
  };
  analysisResult: { max: DataItem | null, min: DataItem | null, avg: number } = {
    max: null,
    min: null,
    avg: 0
  };

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
      if (!item.list_of_permissions.includes(permissions.EDIT_ENTERPRISE_CONTROL)) {
        this.seller = item.id;
      } else {
        this.seller = null;
      }
      this.getInfo(id_enterprise);
    });
    return id_enterprise;
  }

  private getInfo(id_enterprise?: number): void {
    merge()
      .pipe(
        startWith({}),
        map(() => id_enterprise ? id_enterprise : this.getDataLocal()),
        switchMap(id_enterprise => {
          return this._api.postTypeRequest('profile/get-data-sale-balance', { id_enterprise, range: this.range, seller: this.seller })
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => data)
      )
      .subscribe((data: any) => {
        if (data) {
          this.initializeChartOptions();
          this.initializeChartData(data.data);
          this.analysisResult = analyzeData(data.data);
        }
      });
  }

  //Inicializadores de la tabla
  initializeChartData(data: any) {
    this.basicData.labels = [];
    this.basicData.datasets[0].data = [];
    this.basicData.datasets[0].backgroundColor = [];
    this.basicData.datasets[0].borderColor = [];
    if(data) {
      data.forEach((item: any) => {
        //Arma el eje x
        switch (this.range) {
          case 'day':
            //almacena la fecha del dia
            this.basicData.labels.push(formatDate(item.period));
            break;
          case 'week':
            //almacena la semana
            this.basicData.labels.push(getWeekInfo(item.period.split('-W')[1], item.period.split('-W',1)[0]));
            break;
          case 'month':
            //almacena el mes
            this.basicData.labels.push(getMonthName(item.period));
            break;
          default:
            //almacena la fecha del dia
            this.basicData.labels.push(formatDate(item.period));
            break;
        }
        
        //Arma el eje y, un array
        this.basicData.datasets[0].data.push(item.response);
        this.basicData.datasets[0].backgroundColor.push('rgba(255, 159, 64, 0.2)');
        this.basicData.datasets[0].borderColor.push('rgba(255, 159, 64)');
      });
    }

    this.basicData.datasets[0].borderWidth = 2;
  }

  initializeChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: true
          }
        }
      }
    };
  }

  //Función que toma el rango de los datos
  setRange(range: string) {
    this.range = range;
    this.getInfo();
  }
}
