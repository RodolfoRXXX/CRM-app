import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';

@Component({
  selector: 'app-enterprise-configuration',
  templateUrl: './enterprise-configuration.component.html'
})
export class EnterpriseConfigurationComponent implements OnInit {

  enterprise!: Enterprise;
  filters!: any;
  tabs : any = [
    {name: 'Configuración de filtros', icon: 'filter_list', state: 'active'}
  ]

  constructor(
    private _conector: ConectorsService,
    private _actRoute: ActivatedRoute,
    private _notify: NotificationService,
    private _api: ApiService,
    private _router: Router
  ) {

  }

  ngOnInit(): void {
    this._conector.setUpdateTitle('Configuración');
    this.fetchEnterprise();
  }

  fetchEnterprise(): void {
    this._actRoute.data.subscribe(data => {
      const resolverData = data['enterprise'];
      if (resolverData && resolverData.data && resolverData.data.length > 0) {
        this.enterprise = resolverData.data[0];
        console.log(this.enterprise)
        this.getFilters(this.enterprise.id)
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

  getFilters(id_enterprise: number) {
    this._api.postTypeRequest('profile/get-filters', { id_enterprise: id_enterprise }).subscribe( (value: any) => {
      if(value) {
        console.log(value)
        this.filters = value.data
      }
    })
  }

  setTab(tab: number) {
    this.tabs.forEach( (element: any, index: number) => {
      element.state = '';
      (index == tab)?element.state = 'active':'';
    });
  }

}
