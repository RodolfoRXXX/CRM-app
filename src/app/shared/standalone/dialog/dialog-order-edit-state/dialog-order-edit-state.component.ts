import { Component, Inject} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { GetJsonDataService } from 'src/app/services/get-json-data.service';


@Component({
  standalone: true,
  selector: 'app-dialog-order-edit-state',
  templateUrl: './dialog-order-edit-state.component.html',
  styleUrls: ['./dialog-order-edit-state.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class DialogOrderEditStateComponent {

  dataSource: any = new MatTableDataSource();
  displayedColumns: string[] = ['sku', 'product', 'qty', 'status'];

  dataForm!: FormGroup;
  order_status!: any[];
  editRegister: any = [];
  load: boolean = true;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOrderEditStateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    public _auth: AuthService,
    private _notify: NotificationService,
    private _getJson: GetJsonDataService
  ) {
    this._getJson.getData('order_status.json').subscribe((data: any) => {
      this.order_status = data;
    });
    if(this.data) {
      this.getProducts();
    }
    this.createDataForm()
  }

  //función que extrae los productos de una orden existente
  private getProducts(): void {
    if(this.data.detail) {
      const data = JSON.parse(this.data.detail);
      if(data) {
        this.dataSource.data = data;
      }
    }
    this.load = false;
  }

  //devuelve el status, usado para el selector de estado
  getStatus(statusId: number) {
    return this.order_status.find(value => value.id === statusId);
  }

/*  Esta sección maneja los cambios unitarios de cada producto del remito, toma los cambios de genera el usuario de a uno
      y luego envía la información a la base de datos para guardarse, en caso de que se pueda, cierra la orden */
  //Setea el estado en cada registro de la tabla y actualiza el formulario
    private setStatus(id_product: number, status: string) {
      this.dataSource.data.find( (element: any) => {
        if(element.id_product == id_product) {
          element.status = status
          this.dataForm.patchValue({detail: JSON.stringify(this.dataSource.data)})
        }
      })
    }

    //modifica el estado del registro elegido
    changeState(element: any, event: any) {
      //función que busca el elemento modificado y altera su status
      //1 - entregado
      //2 - no entregado
      //3 - cancelado
      console.log(element, event.value)
      //element contiene status actual
      //event.value es el status nuevo
      if((element.status == 2) && (event.value == 1)) {
        console.log("resto la cantidad al stock físico")
        this.editRegister.push({ id_product: element.id_product, editQty: element.qty, type: 'real' })
        this.setStatus(element.id_product, event.value)
      }
      if((element.status == 1) && (event.value == 2)) {
        console.log("sumo la cantidad al stock físico")
        this.editRegister.push({ id_product: element.id_product, editQty: -element.qty, type: 'real' })
        this.setStatus(element.id_product, event.value)
      }
      if((element.status == 2) && (event.value == 4)) {
        console.log("resto la cantidad al stock disponible")
        this.editRegister.push({ id_product: element.id_product, editQty: element.qty, type: '' })
        this.setStatus(element.id_product, event.value)
      }
    }


/*  Esta sección tiene las funciones para cerrar toda la orden desde un solo botón, liberando el stock disponible
      para luego cerrar la orden */










/*  Sección de envío de formulario a la base de datos */
  //Crea el formulario para modificar el detalle de la orden
  createDataForm() {
    this.dataForm = new FormGroup({
      id: new FormControl(this.data.id_order, [
        Validators.required
      ]),
      detail: new FormControl('', [
        Validators.required
      ])
    })
  }

  //envío los cambios a la base de datos
  updateState() {
    console.log(this.dataForm.value)
  }

  /*
  submitPermissions() {
    this._api.postTypeRequest('profile/update-role-permissions', this.permissionForm.value).subscribe({
      next: (res: any) => {
        this.loading_set_permission =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó el usuario
            this._notify.showSuccess('Permisos actualizados con éxito!');
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.');
          }
          setTimeout(() => {
            this.closeDialog(true);
          }, 2000);
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading_set_permission =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })
}*/

//cierro la ventana de diálogo
  closeDialog(state: boolean) {
    this.dialogRef.close(state);
  }

}

/*
para el button de CERRAR TODO
  //este button cambia el estado de todos los productos a "entregado" y cierra la orden

  - recorrer toda la tabla buscando aquellos productos que tengan un status "no entregado" para cambiar su estado a
    "entregado" y guardar en la variable array editRegister() los cambios de cantidades al stock físico y disponible
  - setear una variable que indique si debo cerrar el remito(closeOrder())
  - guardar esta tabla nueva en el formulario
  - llamar a la función updateState() para guardar los cambios en la base de datos


para el button de CONFIRMAR CAMBIOS
  //este button guarda los cambios de estado y cierra la orden si no queda ningun producto sin entregar

  - ya tengo los cambios realizados en cada producto y el array editRegister() actualizado
  - debo recorrer toda la tabla y ver si existe algun producto con status "no entregado", si existe entonces
    setear la variable closeOrder = false(valor inicial false), para que sea TRUE todos los productos deben tener
    un status de "entregado, cancelado o devolución"
  - llamar a la función updateState() para guardar los cambios en la base de datos

*/