import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-enterprise-detail',
  templateUrl: './enterprise-detail.component.html',
  styleUrls: ['./enterprise-detail.component.scss']
})
export class EnterpriseDetailComponent implements OnInit {

  enterprise!: Enterprise;
  load: boolean = true;
  card_values: any = { total_employees: null, total_stock: null, notpaid_orders: null, total_sales: null };
  baseURL = environment.SERVER;

  constructor(
    private _api: ApiService,
    private _actRoute: ActivatedRoute,
    private _notify: NotificationService,
    private _conector: ConectorsService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._conector.setUpdateTitle('Detalles de mi empresa');
    this.fetchEnterprise();

  }

  fetchEnterprise(): void {
    this._actRoute.data.subscribe(data => {
      const resolverData = data['enterprise'];
      if (resolverData && resolverData.data && resolverData.data.length > 0) {
        this.enterprise = resolverData.data[0];
        this.load = false;
      } else {
        this.handleNoEnterprise();
      }
    }, error => {
      this.handleNoEnterprise();
    });
  }

  handleNoEnterprise(): void {
    this._notify.showWarn('No ha sido posible obtener la información. Intentá nuevamente por favor.');
    setTimeout(() => {
      this._router.navigate(['init/settings/index']);
    }, 1500);
  }

  //Esta función busca: PENDIENTE!!!
  //total de empleados(un), valor del stock($), total de órdenes($), pagos de pedidos pendientes($), total de venta en el último mes($)
  getDataCard(id_enterprise: number): void {
    this._api.postTypeRequest('profile/get-enterprise-data', { id_enterprise }).subscribe(
      (value: any) => {
        this.card_values = {
          total_employees: value.data[0].data || 0,
          total_stock: value.data[1].data || 0,
          notpaid_orders: value.data[2].data || 0,
          total_sales: value.data[3].data || 0,
        };
      },
      error => {
        console.error(error);
      }
    );
  }

  editEnterprise(): void {
    this._router.navigate(['init/settings/enterprise-info/enterprise-edit']);
  }

}
