import { Component, Provider } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Storage } from 'src/app/shared/interfaces/storage.interface';

@Component({
  selector: 'app-storage-edit',
  templateUrl: './storage-edit.component.html',
  styleUrls: ['./storage-edit.component.scss']
})
export class StorageEditComponent {

  id_enterprise!: number;
  storage!: Storage;
  dataForm!: FormGroup;
  id_storage!: number;
  activeStatus: boolean = false;
  loading!: boolean;

  constructor(
    private route: ActivatedRoute,
    private _conector: ConectorsService,
    private _api: ApiService,
    private _notify : NotificationService,
    private _router: Router
  ) {
    this.loading = false;
    this.createDataForm();
  }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Edición de depósito')
    this.route.queryParams.subscribe(params => {
      this.id_storage = params['id_storage'];
      if(this.id_storage) {
        this.getStorage(this.id_storage)
      } else {
        this._conector.getEmployee().subscribe( value => {
          this.id_enterprise = value.id_enterprise;
          this.dataForm.patchValue({id_enterprise: this.id_enterprise})
        })
      }
    });
  }

  changeState(status: number) {
    this.dataForm.patchValue({status: status})
    console.log(this.dataForm.value)
    if(this.dataForm.controls['id'].value > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/edit-storage-activation', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó el campo
              this._notify.showSuccess(`El depósito está ${(status == 1)?"activado":"desactivado"}!`);
              setTimeout(() => {
                this.rechargeComponent();
              }, 1500);
            } else{
              //No hubo modificación
              this._notify.showError('No se detectaron cambios. Volvé a realizar la operación.')
            }
          } else{
              //Problemas de conexión con la base de datos(res.status == 0)
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        },
        error: (error) => {
          //Error de conexión, no pudo consultar con la base de datos
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      })
    }
  }  

  getStorage(id_storage: number): void {
    this._api.postTypeRequest('profile/get-storage-id', { id_storage: id_storage }).subscribe( (value:any) => {
      if(value.data) {
        //Se encontró el depósito y lo paso al componente hijo
        this.storage = value.data[0];
        this.setDataForm(this.storage);
        this.activeStatus = (this.storage.status === 1)?true:false;
      }
    })
  }

  //Formulario creación/edición del depósito
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(''),
        id_enterprise: new FormControl('', [
          Validators.required
        ]),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        phone: new FormControl('', [
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        address: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        city: new FormControl('', [
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        state: new FormControl('', [
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        country: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        status: new FormControl(false)
    });
  }

  //Setea los valores del formulario si tuviera que cargarse un depósito
  setDataForm(storage: Storage) {
    this.dataForm.setValue({
      id: (storage.id > 0)?storage.id:'',
      id_enterprise: (storage.id_enterprise > 0)?storage.id_enterprise:0,
      name: (storage.name != '')?storage.name:'',
      phone: (storage.phone != '')?storage.phone:'',
      address: (storage.address != '')?storage.address:'',
      city: (storage.city != '')?storage.city:'',
      state: (storage.state != '')?storage.state:'',
      country: (storage.country != '')?storage.country:'',
      status: (storage.status > 0)?true:false
    })
  }

  //Capturador de errores del valor de formulario
  getErrorName() {
    //name
    if(this.dataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
      return ''
  }
  getErrorPhone() {
    //phone
    if(this.dataForm.controls['phone'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['phone'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
      return ''
  }
  getErrorAddress() {
    //address
    if(this.dataForm.controls['address'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['address'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['address'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
      return ''
  }
  getErrorCity() {
    //city
    if(this.dataForm.controls['city'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['city'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
      return ''
  }
  getErrorState() {
    //state
    if(this.dataForm.controls['state'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['state'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
      return ''
  }
  getErrorCountry() {
    //country
    if(this.dataForm.controls['country'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['country'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['country'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
      return ''
  }

  //Elimina todo lo que el reset básico no limpia
  resetAll() {
    if(this.storage) {
      this.setDataForm(this.storage)
    } else {
      this.dataForm.reset()
      this.dataForm.patchValue({id_enterprise: this.id_enterprise})
    }
  }

  //Navegar a la misma ruta para recargar el componente
  rechargeComponent() {
    window.location.reload();
  }

  onSubmit() {
    this.loading =  true;
    if(this.dataForm.controls['id'].value > 0) {
      //Modifica el depósito
      this._api.postTypeRequest('profile/edit-storage', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó datos depósito
              this._notify.showSuccess('El depósito se modificó con éxito!');
              setTimeout(() => {
                this._router.navigate(['init/main/storage/storage-list']);
              }, 2000);
            } else{
              //No hubo modificación
              this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
            }
          } else{
            //Problemas de conexión con la base de datos(res.status == 0)
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        },
        error: (error: any) => {
          //Error de conexión, no pudo consultar con la base de datos
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      })      
    } else {
      //Crea un depósito nuevo
      this._api.postTypeRequest('profile/create-storage', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.affectedRows == 1){
              //Creó un nuevo depósito
              this._notify.showSuccess('Nuevo depósito creado con éxito!');
              setTimeout(() => {
                this._router.navigate(['init/main/storage/storage-list']);
              }, 2000);
            } else{
              //Ya existe dicho depósito
              this._notify.showWarn('El depósito que intentas crear ya existe.')
            }
          } else{
            //Problemas de conexión con la base de datos(res.status == 0)
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
          }
        },
        error: (error: any) => {
          //Error de conexión, no pudo consultar con la base de datos
          this.loading =  false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      })
    }
  }

}
