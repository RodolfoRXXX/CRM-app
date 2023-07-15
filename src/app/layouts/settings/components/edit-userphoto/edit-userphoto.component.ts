import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-edit-userphoto',
  templateUrl: './edit-userphoto.component.html'
})
export class EditUserphotoComponent implements OnInit {

  userDataForm!: FormGroup;
  base_image!: string;
  name_image!: string;
  data: any = {
    id: 0,
    enterprise: '',
    name: '',
    blanck: true
  }
  disable_submit!: boolean;
  loading!: boolean;
  load!: boolean;
  error_image!: string;

  constructor(
    private _image: ImageService,
    private _auth: AuthService,
    private _api: ApiService,
    private _notify: NotificationService
  ) { 
    this.disable_submit = false;
    this.loading = false;
    this.load = false;
    this.setDataUser();
   }

  ngOnInit(): void { 
    this.createUserForm()
   }

  async getDataUser(): Promise<any> {
    const data = await JSON.parse(this._auth.getDataFromLocalStorage());
    return data;
  }

  setDataUser() {
    this.getDataUser()
        .then( data => {
          console.log(data)
          this.name_image = data.thumbnail;
          this.base_image = environment.SERVER + this.name_image;
          console.log(this.base_image)
          this.data.id = data.id;
          this.data.enterprise = data.enterprise;
          if((data.name)&&(data.name.length)) {
            this.data.name = data.name
          } else {
            this.data.name = data.email.split("@")[0]
          }
          if(data.thumbnail != 'blanck_user.png') {
            this.data.blanck = false;
          }
        })
  }

  createUserForm(): void {
    this.userDataForm = new FormGroup({
        id: new FormControl(''),
        enterprise: new FormControl(''),
        name: new FormControl(''),
        thumbnail : new FormControl('', [
          Validators.required
        ]),
        blanck: new FormControl(true)
    });
  }

  getImageErrorMessage() {
    if(this.userDataForm.controls['thumbnail'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    return ''
  }

  capture_img(event: any) {
    this.load = true;
    this.disable_submit = true;
    const archivoCapturado = event.target.files[0];
    setTimeout(() => {
      if ((archivoCapturado.type == 'image/jpg') || (archivoCapturado.type == 'image/jpeg') || (archivoCapturado.type == 'image/png')){
        if ((archivoCapturado.size > 51200) && (archivoCapturado.size < 10485760)) {
          this._image.extraerBase64(archivoCapturado).then( (imagen:any) => {
            this.load = false;
            try {
              console.log('ok')
              if(imagen.base){
                this.base_image = imagen.base;
                this.userDataForm.patchValue({
                  thumbnail: imagen.base
                })
                this.error_image = '';
              } else {
                this.base_image = '../../../../../assets/images/users/error_image.png';
                this.error_image = 'Ha ocurrido un error con la imagen';
                this.userDataForm.patchValue({
                  thumbnail: ''
                })
              }
            } catch (error) {
              this.base_image = '../../../../../assets/images/users/error_image.png';
              this.error_image = 'Ha ocurrido un error con la imagen';
              this.userDataForm.patchValue({
                thumbnail: ''
              })
            }
          });
        } else if(archivoCapturado.size > 10485760) {
          //error de peso mayor
          this.load = false;
          this.base_image = '../../../../../assets/images/users/error_image.png';
          this.error_image = 'La imagen no debe superar los 10MB';
          this.userDataForm.patchValue({
            thumbnail: ''
          })
        } else {
          //error de peso menor
          this.load = false;
          this.base_image = '../../../../../assets/images/users/error_image.png';
          this.error_image = 'La imagen debe superar los 50KB';
          this.userDataForm.patchValue({
            thumbnail: ''
          })
        }
      } else{
        //error de formato
        this.load = false;
        this.base_image = '../../../../../assets/images/users/error_image.png';
        this.error_image = 'La imagen tiene un formato incompatible';
        this.userDataForm.patchValue({
          thumbnail: ''
        })
      }
      this.disable_submit = false;
    }, 2500);
    
  }
  
  onSubmitUser() {
    this.disable_submit = true;
    this.loading =  true;
    this.userDataForm.patchValue({
      id: this.data.id,
      enterprise: this.data.enterprise,
      name: this.data.name,
      blanck: this.data.blanck
    })
    console.log(this.userDataForm.value)
    this._api.postTypeRequest('profile/load-image', this.userDataForm.value).subscribe({
      next: (res: any) => {
        this.loading =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó la contraseña
            this._notify.showSuccess('Nueva imagen de usuario!');
            this._auth.setDataInLocalStorage(res.data[0].id, res.token, res.data[0].state, res.data[0], this._auth.getRememberOption());
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se detectaron cambios. Ingresá una imagen diferente al actual.')
          }
        } else{
          this.disable_submit = false;
            //Problemas de conexión con la base de datos(res.status == 0)
            this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
        }
      },
      error: (error) => {
        //Error de conexión, no pudo consultar con la base de datos
        this.disable_submit = false;
        this.loading =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

}
