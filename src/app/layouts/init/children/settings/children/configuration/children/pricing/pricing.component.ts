import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  load!: boolean;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _conector: ConectorsService
  ) {
    this.load = true;
  }


  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Planes disponibles')
  }

  getDataLocal(): Promise<any> {
    const data = JSON.parse(this._auth.getDataFromLocalStorage());
    return data.id_enterprise;
  }


  rechargeData() {
    this._conector.setUpdate(true);
  }

}

