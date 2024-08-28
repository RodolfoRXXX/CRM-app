import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { Employee } from 'src/app/shared/interfaces/employee.interface';
import { Provider } from 'src/app/shared/interfaces/provider.interface';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.scss']
})
export class ProviderDetailComponent implements OnInit {

  load: boolean = true;
  employee!: Employee;
  id_provider!: number;
  provider!: Provider;
  card_values: any = { total_art: null, total_inv: null, last_shop: null };

  constructor(
    private route: ActivatedRoute,
    private _api: ApiService,
    private _conector: ConectorsService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._conector.setUpdateTitle('Detalle del proveedor');
    this.route.queryParams.subscribe(params => {
      this.id_provider = parseInt(params['id_provider']);
      if (this.id_provider) {
        this.loadProviderData(this.id_provider);
      } else {
        this._router.navigate(['init/main/provider/provider-list']);
      }
    });
  }

  loadProviderData(id_provider: number): void {
    this.getProvider(id_provider);
    this.getDataLocal();
  }

  getProvider(id_provider: number): void {
    this._api.postTypeRequest('profile/get-provider-id', { id_provider }).subscribe(
      (value: any) => {
        if (value.data) {
          this.provider = value.data[0];
          this.load = false;
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  getDataLocal(): void {
    this._conector.getEmployee().subscribe(
      (employee: Employee) => {
        this.employee = employee;
        this.getDataCard(employee.id_enterprise, this.id_provider);
      },
      error => {
        console.error(error);
      }
    );
  }

  getDataCard(id_enterprise: number, id_provider: number): void {
    this._api.postTypeRequest('profile/get-provider-data', { id_enterprise, id_provider }).subscribe(
      (value: any) => {
        this.card_values = {
          total_art: value.data[0]?value.data[0].data:0,
          total_inv: value.data[1]?value.data[1].data:0,
          last_shop: value.data[2]?value.data[2].data:0,
        };
      },
      error => {
        console.error(error);
      }
    );
  }

  editProvider(id_provider: number): void {
    this._router.navigate(['init/main/provider/provider-edit'], { queryParams: { id_provider } });
  }
}
