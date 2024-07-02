import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { User } from 'src/app/shared/interfaces/user.interface';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent {

  @Input() user!: User;
  @Input() screenLarge! : any;

  dataForm!: FormGroup;
  base_image!: string;
  error_image!: string;
  disable_pic!: boolean;
  baseURL = environment.SERVER;
  load: boolean = true;
  loading: boolean = false;

  constructor(
    private _image: ImageService,
  ) {
    this.createDataForm();
  }

  //Toma los cambios del Input de entrada y actualiza el formulario
  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.setDataForm(changes['user'].currentValue)
      this.load = false;
    }
  }

  //Función que crea el formulario para editar la imagen
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(''),
        enterprise: new FormControl(''),
        name: new FormControl(''),
        thumbnail : new FormControl('', [
          Validators.required
        ]),
        blanck: new FormControl(true)
    });
  }

  //Setea los valores del formulario si tuviera que cargarse un empleado
  setDataForm(user: User) {
    this.dataForm.setValue({
      id: (user.id > 0)?user.id:'',
      enterprise: (user.id_enterprise > 0)?user.id_enterprise:'',
      name: (user.name != '')?user.name:'',
      thumbnail: (user.thumbnail != '')?user.thumbnail:'',
    })
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
                this.dataForm.patchValue({
                  thumbnail: imagen.base
                })
                this.error_image = '';
                this.disable_pic = false;
              } else {
                this.base_image = '../../../../../assets/images/users/error_image.png';
                this.error_image = 'Ha ocurrido un error con la imagen';
                this.dataForm.patchValue({
                  thumbnail: ''
                })
              }
            } catch (error) {
              this.base_image = '../../../../../assets/images/users/error_image.png';
              this.error_image = 'Ha ocurrido un error con la imagen';
              this.dataForm.patchValue({
                thumbnail: ''
              })
            }
          });
        } else if(archivoCapturado.size > 10485760) {
          //error de peso mayor
          this.load = false;
          this.base_image = '../../../../../assets/images/users/error_image.png';
          this.error_image = 'La imagen no debe superar los 10MB';
          this.dataForm.patchValue({
            thumbnail: ''
          })
        } else {
          //error de peso menor
          this.load = false;
          this.base_image = '../../../../../assets/images/users/error_image.png';
          this.error_image = 'La imagen debe superar los 50KB';
          this.dataForm.patchValue({
            thumbnail: ''
          })
        }
      } else{
        //error de formato
        this.load = false;
        this.base_image = '../../../../../assets/images/users/error_image.png';
        this.error_image = 'La imagen tiene un formato incompatible';
        this.dataForm.patchValue({
          thumbnail: ''
        })
      }
    }, 2500);
  }

  getImageErrorMessage() {
    if(this.dataForm.controls['thumbnail'].hasError('required')) {
      return 'Tenés que ingresar un valor'}
    return ''
  }

  onSubmit() {
    console.log(this.dataForm.value)
  }

}
