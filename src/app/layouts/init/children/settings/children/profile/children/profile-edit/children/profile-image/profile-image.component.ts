import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageService } from 'src/app/services/image.service';
import { NotificationService } from 'src/app/services/notification.service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent {

  @Input() user!: User;

  isDragOver = false;
  imageSrc: string | ArrayBuffer | null = null;
  dataForm!: FormGroup;
  loading: boolean = false;
  load_image!: boolean;
  error_image!: string;
  uriImg = environment.SERVER;

  constructor(
    private _image: ImageService,
    private _api: ApiService,
    private _notify: NotificationService,
    private _auth: AuthService
  ) {
    this.createDataForm();
  }
  
  // Toma los cambios del Input de entrada y actualiza la data
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.setDataForm(changes['user'].currentValue)
    }
  }
  
  // Formulario edición de imagen de producto
  createDataForm(): void {
    this.dataForm = new FormGroup({
      id: new FormControl('', [
        Validators.required
      ]),
      id_enterprise: new FormControl('', [
        Validators.required
      ]),
      thumbnail: new FormControl('', [
        Validators.required
      ]),
      prev_thumb: new FormControl('', [
        Validators.required
      ])
    });
  }

  // Setea los valores del formulario
  setDataForm(user: User): void {
    if (user) {
      this.dataForm.patchValue({
        id: (user.id > 0)?user.id:'',
        id_enterprise: (user.id_enterprise > 0)?user.id_enterprise:'',
        thumbnail: '',
        prev_thumb: (user.thumbnail != '')?user.thumbnail:''
      });
  
      if (user.thumbnail) {
        this.imageSrc = this.uriImg + user.thumbnail;
      } else {
        this.imageSrc = ''; // Limpia la imagen si no hay una disponible
      }
    }
  }

  //Eventos que toman una imagen
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }
  onDrop(event: DragEvent) {
    this.load_image = true;
    this.imageSrc = '';
    this.error_image = '';
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.readImageFile(file);
    }
  }
  readImageFile(file: File) {
    const reader = new FileReader();
    setTimeout(() => {
      if ((file.type == 'image/jpg') || (file.type == 'image/jpeg') || (file.type == 'image/png')){
        if ((file.size > 10240) && (file.size < 10485760)) {
          this._image.extraerBase64(file).then( (imagen:any) => {
            try {
              if(imagen.base){
                this.dataForm.patchValue({
                  thumbnail: imagen.base
                })
              } else {
                this.error_image = 'Ha ocurrido un error con la imagen';
                this.dataForm.patchValue({
                  thumbnail: ''
                })
              }
            } catch (error) {
              this.error_image = 'Ha ocurrido un error con la imagen';
              this.dataForm.patchValue({
                thumbnail: ''
              })
            }
          });
        } else if(file.size > 10485760) {
          //error de peso mayor
          this.error_image = 'La imagen no debe superar los 10MB';
          this.dataForm.patchValue({
            thumbnail: ''
          })
        } else {
          //error de peso menor
          this.error_image = 'La imagen debe superar los 50KB';
          this.dataForm.patchValue({
            thumbnail: ''
          })
        }
      } else{
        //error de formato
        this.error_image = 'La imagen tiene un formato incompatible';
        this.dataForm.patchValue({
          thumbnail: ''
        })
      }
      this.load_image = false;
      reader.onload = (e) => {
        if(this.error_image.length == 0) {
          this.imageSrc = (e.target?.result)?(e.target?.result):'';
        } else {
          this.imageSrc = '';
        }
      };
      reader.readAsDataURL(file);
    }, 2000);
  }
  capture_img(event: any) {
    this.load_image = true;
    this.imageSrc = '';
    this.error_image = '';
    const file = event.target.files[0];
    this.readImageFile(file);
  }

  //Elimina todo lo que el reset básico no limpia
  resetAll() {
    this.setDataForm(this.user);
    this.error_image = '';
  }

  //Submit para guardar la imagen del producto
  onSubmit() {
    if(this.dataForm.controls['id'].value > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/update-user-image', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.changedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess('La imagen del producto se ha modificado con éxito!');
              this._auth.setDataInLocalStorage(res.data[0].id, res.token, res.data[0].state, res.data[0], this._auth.getRememberOption());
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else{
              //No hubo modificación
              this._notify.showError('No se detectaron cambios. Ingresá una imagen diferente a la actual.')
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

}
