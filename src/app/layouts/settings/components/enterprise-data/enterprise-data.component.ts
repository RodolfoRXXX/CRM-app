import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConectorsService } from 'src/app/services/conectors.service';
import { ImageService } from 'src/app/services/image.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-enterprise-data',
  templateUrl: './enterprise-data.component.html'
})
export class EnterpriseDataComponent implements OnInit {

  picDataForm!: FormGroup;
  userDataForm!: FormGroup;
  disable_pic!: boolean;
  disable_submit!: boolean;
  loading!: boolean;
  load!: boolean;
  base_image!: string;
  error_image!: string;
  screenLarge!: boolean;

  constructor(
    private _auth: AuthService,
    private _api: ApiService,
    private _notify: NotificationService,
    private _conector: ConectorsService,
    private _image: ImageService,
  ) { 
    this.base_image = '../../../../../assets/images/users/blanck_enterprise.png';
    this.disable_pic = true;
    this.disable_submit = false;
    this.loading = false;
    this.load = true;
    this.setDataUser();
    this.createPicForm();
    this.createUserForm();
   }

  ngOnInit(): void {
    //Modifica el título de la vista principal
    this._conector.setUpdateTitle('Configuración/Mi empresa')

    //Carga el detector de tamaño del dispositivo
    this._conector.getScreenState().subscribe( screen => {
      this.screenLarge = screen
    })
  }

  ngOnDestroy() {
    //Modifica el título de la vista principal al cerrar el componente
    this._conector.setUpdateTitle('Configuración')
  }

  async getDataUser(): Promise<any> {
    const data = await JSON.parse(this._auth.getDataFromLocalStorage());
    return data;
  }

  setDataUser() {
    this.getDataUser()
        .then( (data: { id_enterprise: any; }) => {
          this._api.postTypeRequest('profile/get-enterprise', { id: data.id_enterprise }).subscribe({
            next: (res: any) => {
              this.load = false;
              if(res.status == 1){
                //Accedió a la base de datos y no hubo problemas
                if(res.data.length) {
                  this.base_image = environment.SERVER + res.data[0].thumbnail;
                  this.picDataForm.patchValue({
                    id: res.data[0].id,
                  })
                  if(res.data[0].thumbnail != 'blanck_enterprise.png') {
                    this.picDataForm.patchValue({
                      blanck: false
                    })
                  }
                  this.setFormValue(res.data[0]);
                } else {
                  this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
                }
              } else{
                  //Problemas de conexión con la base de datos(res.status == 0)
                  this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
              }
            },
            error: (error: any) => {
              //Error de conexión, no pudo consultar con la base de datos
              this.load = false;
              this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
            }
          })
        })
        .finally( () => this.error_image = '')
  }

  setFormValue(data: any) {
    this.userDataForm.controls['id'].setValue(data.id);
    this.userDataForm.controls['name'].setValue(data.name);
    this.userDataForm.controls['cuit'].setValue(data.cuit);
    this.userDataForm.controls['address'].setValue(data.address);
    this.userDataForm.controls['cp'].setValue(data.cp);
    this.userDataForm.controls['phone_1'].setValue(data.phone_1);
    this.userDataForm.controls['phone_2'].setValue(data.phone_2);
    this.userDataForm.controls['city'].setValue(data.city);
    this.userDataForm.controls['state'].setValue(data.state);
    this.userDataForm.controls['country'].setValue(data.country);
  }

  createPicForm(): void {
    this.picDataForm = new FormGroup({
        id: new FormControl(''),
        thumbnail : new FormControl('', [
          Validators.required
        ]),
        blanck: new FormControl(true)
    });
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        id: new FormControl(''),
        name : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        cuit : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        address : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        cp : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(30)
        ]),
        phone_1 : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        phone_2 : new FormControl('', [
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        city : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        state : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
        country : new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15)
        ]),
    });
  }

  capture_img(event: any) {
    this.load = true;
    const archivoCapturado = event.target.files[0];
    setTimeout(() => {
      if ((archivoCapturado.type == 'image/jpg') || (archivoCapturado.type == 'image/jpeg') || (archivoCapturado.type == 'image/png')){
        if ((archivoCapturado.size > 10240) && (archivoCapturado.size < 10485760)) {
          this._image.extraerBase64(archivoCapturado).then( (imagen:any) => {
            this.load = false;
            try {
              if(imagen.base){
                this.base_image = imagen.base;
                this.picDataForm.patchValue({
                  thumbnail: imagen.base
                })
                this.disable_pic = false;
                this.error_image = '';
              } else {
                this.base_image = '../../../../../assets/images/users/error_image.png';
                this.error_image = 'Ha ocurrido un error con la imagen';
                this.picDataForm.patchValue({
                  thumbnail: ''
                })
              }
            } catch (error) {
              this.base_image = '../../../../../assets/images/users/error_image.png';
              this.error_image = 'Ha ocurrido un error con la imagen';
              this.picDataForm.patchValue({
                thumbnail: ''
              })
            }
          });
        } else if(archivoCapturado.size > 10485760) {
          //error de peso mayor
          this.load = false;
          this.base_image = '../../../../../assets/images/users/error_image.png';
          this.error_image = 'La imagen no debe superar los 10MB';
          this.picDataForm.patchValue({
            thumbnail: ''
          })
        } else {
          //error de peso menor
          this.load = false;
          this.base_image = '../../../../../assets/images/users/error_image.png';
          this.error_image = 'La imagen debe superar los 50KB';
          this.picDataForm.patchValue({
            thumbnail: ''
          })
        }
      } else{
        //error de formato
        this.load = false;
        this.base_image = '../../../../../assets/images/users/error_image.png';
        this.error_image = 'La imagen tiene un formato incompatible';
        this.picDataForm.patchValue({
          thumbnail: ''
        })
      }
    }, 2500);
  }

  getError() {
    //name
    if(this.userDataForm.controls['name'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.userDataForm.controls['name'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['name'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';

    //cuit
    if(this.userDataForm.controls['cuit'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['cuit'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';

    //address
    if(this.userDataForm.controls['address'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['address'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';

    //código postal
    if(this.userDataForm.controls['cp'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['cp'].hasError('maxlength')) return 'Este valor debe tener menos de 30 caracteres';

    //phone
    if(this.userDataForm.controls['phone_1'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['phone_1'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';

    //phone2
    if(this.userDataForm.controls['phone_2'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['phone_2'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';

    //city
    if(this.userDataForm.controls['city'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.userDataForm.controls['city'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['city'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';

    //state
    if(this.userDataForm.controls['state'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.userDataForm.controls['state'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['state'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';

    //country
    if(this.userDataForm.controls['country'].hasError('required')) return 'Tenés que ingresar un valor';
    if(this.userDataForm.controls['country'].hasError('minlength')) return 'Este valor debe tener más de 4 caracteres';
    if(this.userDataForm.controls['country'].hasError('maxlength')) return 'Este valor debe tener menos de 15 caracteres';
    
    return ''
  }

  onSubmitPic() {
    this.disable_pic = true;
    this.load = true;
    this._api.postTypeRequest('profile/load-logo-image', this.picDataForm.value).subscribe({
      next: (res: any) => {
        this.load =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó la imagen
            this.picDataForm.controls['thumbnail'].reset;
            this._notify.showSuccess('Nueva imagen de empresa!');
          } else{
            //No hubo modificación
            this._notify.showError('No se detectaron cambios. Ingresá una imagen diferente al actual.')
          }
        } else{
            //Problemas de conexión con la base de datos(res.status == 0)
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.load =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

  onSubmitUser() {
    this.disable_submit = true;
    this.loading =  true;
    this._api.postTypeRequest('profile/update-enterprise', this.userDataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.data.changedRows == 1){
            //Modificó datos empresa
            this._notify.showSuccess('Información actualizada con éxito!');
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se detectaron cambios. Ingresá valores diferentes a los actuales.')
          }
          setTimeout(() => {
            this._conector.setUpdate(true);
          }, 2000);
        } else{
          //Problemas de conexión con la base de datos(res.status == 0)
          this.disable_submit = false;
          this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error: any) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

}
