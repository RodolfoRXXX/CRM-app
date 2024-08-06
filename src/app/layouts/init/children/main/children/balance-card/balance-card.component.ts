import { Component, OnInit } from '@angular/core';
import { merge, startWith, map, switchMap, catchError, of as observableOf } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.scss']
})
export class BalanceCardComponent implements OnInit {

  asicData: any;
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
      if (item.name_role !== 'administrador') {
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
        }
      });
  }

  //Inicializadores de la tabla
  initializeChartData(data: any) {
    this.basicData.labels = [];
    this.basicData.datasets[0].data = [];
    this.basicData.datasets[0].backgroundColor = [];
    this.basicData.datasets[0].borderColor = [];

    data.forEach((item: any) => {
      //Arma el eje x, un arrau
      switch (this.range) {
        case 'day':
          //almacena la fecha del dia
          this.basicData.labels.push(this.formatDate(item.period));
          break;
        case 'week':
          //almacena la semana
          this.basicData.labels.push(this.getWeekInfo(item.period.split('-W')[1], item.period.split('-W',1)[0]));
          break;
        case 'month':
          //almacena el mes
          this.basicData.labels.push(this.getMonthName(item.period));
          break;
        default:
          //almacena la fecha del dia
          this.basicData.labels.push(this.formatDate(item.period));
          break;
      }
      
      //Arma el eje y, un array
      this.basicData.datasets[0].data.push(item.response);
      this.basicData.datasets[0].backgroundColor.push('rgba(255, 159, 64, 0.2)');
      this.basicData.datasets[0].borderColor.push('rgba(255, 159, 64)');
    });

    this.basicData.datasets[0].borderWidth = 2;
  }

  //Función que define que semana es
  private getWeekInfo(weekNumber: number, year: number) {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7;
    const firstDayOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
  
    // Ajuste para que el primer día sea lunes
    const dayOfWeek = firstDayOfWeek.getDay();
    const diff = firstDayOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    firstDayOfWeek.setDate(diff);
  
    const month = firstDayOfWeek.toLocaleString('es-ES', { month: 'long' });
  
    // Determinar si es la primera, segunda, etc., semana del mes
    const startOfMonth = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), 1);
    const weekOfMonth = Math.ceil(((firstDayOfWeek.getDate() - 1) + startOfMonth.getDay()) / 7);
  
    return `${weekOfMonth}ª semana de ${month}.`;
  }

  //Función que devuelve el día del mes
  formatDate(dateString: string) {
    // Diccionario para los nombres abreviados de los meses en español
    const monthNames = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
  
    // Parsear la fecha en formato YYYY-MM-DD
    const [year, day, month] = dateString.split('-').map(Number);
  
    // Obtener el nombre del mes abreviado
    const monthAbbreviation = monthNames[month - 1]; // Los meses en el array están indexados desde 0
  
    // Formatear la fecha en DD-MMM
    return `${day.toString().padStart(2, '0')}-${monthAbbreviation}`;
  }

  //Función que devuelve el nombre del mes
  getMonthName(monthNumber: number) {
    // Verificar que el número del mes esté en el rango válido
    if (monthNumber < 1 || monthNumber > 12) {
      throw new Error('Número de mes inválido. Debe estar entre 1 y 12.');
    }
  
    // Diccionario para los nombres completos de los meses en español
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    // Devolver el nombre del mes correspondiente
    return monthNames[monthNumber - 1];
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


