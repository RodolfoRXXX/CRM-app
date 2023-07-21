import { Component, Inject, OnInit} from '@angular/core';
import { MaterialModule } from 'src/app/material/material/material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/enviroments/enviroment';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class DialogComponent implements OnInit {

  userDataForm!: FormGroup;
  base_image!: string;
  name_image!: string;
  state: any = {
    id: 0,
    enterprise: '',
    blanck: true
  }
  disable_submit!: boolean;
  loading!: boolean;
  load!: boolean;
  error_image!: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _image: ImageService,
    private _auth: AuthService,
    private _api: ApiService,
    private _notify: NotificationService,
  ) { 
    this.disable_submit = false;
    this.loading = false;
    this.load = false;
    this.createUserForm();
  }

  ngOnInit(): void {
    this.name_image = this.data.thumbnail;
    this.base_image = environment.SERVER + this.name_image;
    this.state.id = this.data.id;
    this.state.enterprise = this.data.enterprise;
    this.state.blanck = this.data.blanck;
  }

  createUserForm() {
    this.userDataForm = new FormGroup({
      id: new FormControl(''),
      enterprise: new FormControl(''),
      thumbnail : new FormControl('', [
        Validators.required
      ]),
      blanck: new FormControl(true)
  });
  }

  cancel() {
    this.dialogRef.close();
  }

  getImageErrorMessage() {
    if(this.userDataForm.controls['thumbnail'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    return ''
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
    }, 2500);
  }

  imageSubmit() {
    this.disable_submit = true;
    this.loading =  true;
    this.userDataForm.patchValue({
      id: this.state.id,
      enterprise: this.state.enterprise,
      blanck: this.state.blanck
    })
    console.log(this.userDataForm.value);
    this._api.postTypeRequest('profile/load-logo-image', this.userDataForm.value).subscribe({
      next: (res: any) => {
        this.load =  false;
        if(res.status == 1){
          //Accedió a la base de datos y no hubo problemas
          if(res.changedRows == 1){
            //Modificó la contraseña
            this.dialogRef.close(true);
            this._notify.showSuccess('Nueva logo de usuario!');
          } else{
            //No hubo modificación
            this.disable_submit = false;
            this._notify.showError('No se detectaron cambios. Ingresá un logo diferente al actual.')
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
        this.load =  false;
        this._notify.showWarn('No ha sido posible conectarse a la base de datos. Intentá nuevamente por favor.');
      }
    })
  }

}


