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
import { Router } from '@angular/router';


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
  close_order!: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogOrderEditStateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _api: ApiService,
    public _auth: AuthService,
    private _notify: NotificationService,
    private _getJson: GetJsonDataService,
    private _router: Router
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


/*  Esta sección maneja los cambios unitarios de cada producto del remito, toma los cambios que genera el usuario de a uno
      y luego envía la información a la base de datos para guardarse, y en caso de que se pueda, cierra la orden */

  //Setea el estado en cada registro de la tabla y actualiza el formulario
    private setStatusByOne(id_product: number, status: string) {
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
      //element contiene status actual
      //event.value es el status nuevo
      if((element.status == 2) && (event.value == 1)) {
        //console.log("resto la cantidad al stock físico")
        this.editRegister.push({ id_product: element.id_product, editQty: element.qty, type: 'real' })
        this.setStatusByOne(element.id_product, event.value)
      }
      if((element.status == 1) && (event.value == 2)) {
        //console.log("sumo la cantidad al stock físico")
        this.editRegister.push({ id_product: element.id_product, editQty: -element.qty, type: 'real' })
        this.setStatusByOne(element.id_product, event.value)
      }
      if((element.status == 2) && (event.value == 4)) {
        //console.log("sumo la cantidad al stock disponible, es decir, que devuelvo al stock disponible")
        this.editRegister.push({ id_product: element.id_product, editQty: -element.qty, type: '' })
        this.setStatusByOne(element.id_product, event.value)
      }
    }

    //función que recorre el json con los productos y verifica si alguno tiene el status "no entregado", si es así, devuelve FALSE
    verificateStatus(): boolean {
      const data = !this.dataSource.data.find( (element: any) => element.status == 2 )
      return data
    }

    //función que es llamada por el botón "Confirmar cambios"
    closeByOne() {
      this.loading = true;
      //verifico que el listado de productos no contenga "no entregado"
      this.close_order = this.verificateStatus()
      this.updateState()
    }

/*  Esta sección tiene las funciones para cerrar toda la orden desde un solo botón, liberando el stock disponible
      para luego cerrar la orden */
    setStatusAll() {
      this.editRegister = []
      const list = JSON.parse(this.data.detail)
      if(list) {
        list.forEach((element: any) => {
          if(element.status == 2) {
            element.status = 1
            this.editRegister.push({ id_product: element.id_product, editQty: element.qty, type: 'real' })
          }
        });
        this.close_order = true;
        this.dataForm.patchValue({detail: JSON.stringify(list)})
      }
    }

    //función que es llamada por el botón "Cerrar todo"
    closeAll() {
      this.loading = true;
      //repaso todo el listado de productos y cambio aquellos con estado "no entregado" a "entregado"
      this.setStatusAll()
      this.updateState()
    }

  //Función que abre la orden, no hace más que eso
  openOrder() {
    this.loading =  true;
    this._api.postTypeRequest('profile/update-order-open-state', {id: this.data.id_order, status: 1}).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.affectedRows == 1){
            //Modificó el remito
            this._notify.showSuccess('El remito se reabrió con éxito!');
          } else{
            //No hubo modificación
            this._notify.showError('No se realizaron cambios. Intentá nuevamente.');
          }
          setTimeout(() => {
            this.closeDialog(true);
          }, 2000);
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })
  }

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
    this._api.postTypeRequest('profile/update-order-state', {form: this.dataForm.value, edit: this.editRegister, close_order: this.close_order}).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.affectedRows == 1){
            //Modificó el remito
            this._notify.showSuccess('Estado del remito actualizado con éxito!');
          } else{
            //No hubo modificación
            this._notify.showError('No se realizaron cambios. Intentá nuevamente.');
          }
          setTimeout(() => {
            this.closeDialog(true);
          }, 2000);
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intente nuevamente por favor.');
      }
    })
  }

//cierro la ventana de diálogo
  closeDialog(state: boolean) {
    if(state) {
      this._router.navigate(['init/main/order/order-list']);
    }
    this.dialogRef.close(state);
  }

}