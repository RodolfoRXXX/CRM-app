import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { calculateDateLimit } from 'src/app/shared/functions/date.function';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-enterprise-detail',
  templateUrl: './enterprise-detail.component.html'
})
export class EnterpriseDetailComponent implements OnInit {

  enterprise!: Enterprise;
  load: boolean = true;
  date_limit!: string;
  card_values: any = { total_employees: null, total_stock: null, pending: null, total_sale: null };
  tabs : any = [
    {name: 'Descripción', icon: 'edit', state: 'active'}
  ]
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
    this.date_limit = calculateDateLimit(30);
    this.getDataCard();
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

  setTab(tab: number) {
    this.tabs.forEach( (element: any, index: number) => {
      element.state = '';
      (index == tab)?element.state = 'active':'';
    });
  }

  getDataCard(): void {
    if (this.date_limit) {
      forkJoin({
        total_sale: this._api.postTypeRequest('profile/get-data-total-sale', { id_enterprise: this.enterprise.id, date_limit: this.date_limit, seller: null }),
        pending: this._api.postTypeRequest('profile/get-user-pending', { id_enterprise: this.enterprise.id, date_limit: this.date_limit, seller: null }),
        total_stock: this._api.postTypeRequest('profile/get-total-stock', { id_enterprise: this.enterprise.id }),
        total_employees: this._api.postTypeRequest('profile/get-count-users', { id: this.enterprise.id })
      }).subscribe({
        next: (results: any) => {
          this.card_values.total_sale = results.total_sale.data[0]?.response;
          this.card_values.pending = results.pending.data[0]?.response;
          this.card_values.total_stock = results.total_stock.data[0]?.response;
          this.card_values.total_employees = results.total_employees.data[0]?.total;
        }
      });
    }
  }

  editEnterprise(): void {
    this._router.navigate(['init/settings/enterprise-info/enterprise-edit']);
  }

}
