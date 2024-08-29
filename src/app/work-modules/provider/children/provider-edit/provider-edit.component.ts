import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Provider } from 'src/app/shared/interfaces/provider.interface';

@Component({
  selector: 'app-provider-edit',
  templateUrl: './provider-edit.component.html',
  styleUrls: ['./provider-edit.component.scss']
})
export class ProviderEditComponent implements OnInit {

  emailReg = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
  );
  id_enterprise!: number;
  provider!: Provider;
  dataForm!: FormGroup;
  id_provider!: number;
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
    this._conector.setUpdateTitle('Edición de proveedor')
    this.route.queryParams.subscribe(params => {
      this.id_provider = params['id_provider'];
      if(this.id_provider) {
        this.getProvider(this.id_provider)
      } else {
        this._conector.getEmployee().subscribe( value => {
          this.id_enterprise = value.id_enterprise;
          this.dataForm.patchValue({id_enterprise: this.id_enterprise})
        })
      }
    });
  }

  getProvider(id_provider: number): void {
    this._api.postTypeRequest('profile/get-provider-id', { id_provider: id_provider }).subscribe( (value:any) => {
      if(value.data) {
        //Se encontró el proveedor y lo paso al componente hijo
        this.provider = value.data[0];
        this.setDataForm(this.provider);
      }
    })
  }

  //Formulario creación/edición del proveedor
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
        whatsapp: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          (control: AbstractControl):ValidationErrors|null => {
            return !this.emailReg.test(control.value) ? {error_format: {value: control.value}} : null;}
        ]),
        address: new FormControl('', [
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        country: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50)
        ]),
        created: new FormControl('')
    });
  }

  //Setea los valores del formulario si tuviera que cargarse un producto
  setDataForm(provider: Provider) {
    this.dataForm.setValue({
      id: (provider.id > 0)?provider.id:'',
      id_enterprise: (provider.id_enterprise > 0)?provider.id_enterprise:'',
      name: (provider.name != '')?provider.name:'',
      phone: (provider.phone != '')?provider.phone:'',
      whatsapp: (provider.whatsapp != '')?provider.whatsapp:'',
      email: (provider.email != '')?provider.email:'',
      address: (provider.address != '')?provider.address:'',
      country: (provider.country != '')?provider.country:'',
      created: (provider.created != '')?provider.created:''
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
  getErrorWhatsapp() {
    //whatsapp
    if(this.dataForm.controls['whatsapp'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['whatsapp'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['whatsapp'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
      return ''
  }
  getErrorEmail() {
    //email
    if(this.dataForm.controls['email'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.dataForm.controls['email'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['email'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
    if(this.dataForm.controls['email'].hasError('error_format')) return 'No es un correo válido';
      return ''
  }
  getErrorAddress() {
    //address
    if(this.dataForm.controls['address'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.dataForm.controls['address'].hasError('maxlength')) return 'Este valor debe tener menos de 50 caracteres';
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
    if(this.provider) {
      this.setDataForm(this.provider)
    } else {
      this.dataForm.reset()
      this.dataForm.patchValue({id_enterprise: this.id_enterprise})
    }
  }

  onSubmit() {
    this.loading =  true;
    if(this.dataForm.controls['id'].value > 0) {
      //Modifica el proveedor
      this._api.postTypeRequest('profile/edit-provider', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.changedRows == 1){
              //Modificó datos proveedor
              this._notify.showSuccess('El proveedor se modificó con éxito!');
              setTimeout(() => {
                this._router.navigate(['init/main/provider/provider-list']);
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
      //Crea un proveedor nuevo
      this._api.postTypeRequest('profile/create-provider', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.data.affectedRows == 1){
              //Creó un nuevo proveedor
              this._notify.showSuccess('Nuevo proveedor creado con éxito!');
              setTimeout(() => {
                this._router.navigate(['init/main/provider/provider-list']);
              }, 2000);
            } else{
              //Ya existe dicho proveedor
              this._notify.showWarn('El proveedor que intentas crear ya existe.')
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
