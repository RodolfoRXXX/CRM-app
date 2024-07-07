import { Component, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { Enterprise } from 'src/app/shared/interfaces/enterprise.interface';

@Component({
  selector: 'app-option1',
  templateUrl: './option1.component.html',
  styleUrls: ['./option1.component.scss']
})
export class Option1Component {

  @Input() enterprise!: Enterprise;

  recharge: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'edit'];
  dataSource = new MatTableDataSource();

  constructor(
    private _api: ApiService
  ) {}

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['enterprise']) {
      this.setTable(changes['enterprise'].currentValue.id)
    }
  }

  //Cargar la tabla
  setTable(id_enterprise: number) {
    this._api.postTypeRequest('profile/get-option1', { id_enterprise: id_enterprise }).subscribe( (value: any) => {
      if(value) {
        this.recharge = false;
        this.dataSource.data = value.data;
      } else {
        this.recharge = true;
      }
    })
  }

  //Editar un valor
  editOption(id_option: number) {
    console.log(id_option)
  }

  //Recargar los datos
  rechargeData() {
    this.setTable(this.enterprise.id);
  }

  //Agregar nuevo valor
  addNewValue() {

  }

}
