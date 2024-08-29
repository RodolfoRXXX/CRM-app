import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ImageService } from 'src/app/services/image.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.scss']
})
export class ProductImageComponent {

  @Input() product!: Product;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() changeDetected = new EventEmitter<boolean>();

  isDragOver = false;
  imageSrc: string | ArrayBuffer | null = null;
  dataForm!: FormGroup;
  loading!: boolean;
  load_image!: boolean;
  error_image!: string;
  uriImg = environment.SERVER;

  constructor(
    private _image: ImageService,
    private _api: ApiService,
    private _notify: NotificationService,
    private _router: Router
  ) {
    this.loading = false;
    this.createDataForm();
  }
  
  // Toma los cambios del Input de entrada y actualiza la data
  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.setDataForm(changes['product'].currentValue)
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
      image: new FormControl('', [
        Validators.required,
      ]),
      prev_thumb: new FormControl('', [
        Validators.required
      ])
    });
  }

  // Setea los valores del formulario
  setDataForm(product: Product): void {
    if (product) {
      this.dataForm.patchValue({
        id: (product.id > 0)?product.id:'',
        id_enterprise: (product.id_enterprise > 0)?product.id_enterprise:'',
        image: '',
        prev_thumb: (product.image != '')?product.image:''      
      });
  
      if (product.image) {
        this.imageSrc = this.uriImg + product.image;
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
                  image: imagen.base
                })
              } else {
                this.error_image = 'Ha ocurrido un error con la imagen';
                this.dataForm.patchValue({
                  image: ''
                })
              }
            } catch (error) {
              this.error_image = 'Ha ocurrido un error con la imagen';
              this.dataForm.patchValue({
                image: ''
              })
            }
          });
        } else if(file.size > 10485760) {
          //error de peso mayor
          this.error_image = 'La imagen no debe superar los 10MB';
          this.dataForm.patchValue({
            image: ''
          })
        } else {
          //error de peso menor
          this.error_image = 'La imagen debe superar los 50KB';
          this.dataForm.patchValue({
            image: ''
          })
        }
      } else{
        //error de formato
        this.error_image = 'La imagen tiene un formato incompatible';
        this.dataForm.patchValue({
          image: ''
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
    console.log(event)
    this.load_image = true;
    this.imageSrc = '';
    this.error_image = '';
    const file = event.target.files[0];
    this.readImageFile(file);
  }

  //Elimina todo lo que el reset básico no limpia
  resetAll() {
    this.setDataForm(this.product)
    this.error_image = '';
    this.load_image = false;
    this.fileInput.nativeElement.value = '';
  }

  //Submit para guardar la imagen del producto
  onSubmit() {
    if(this.dataForm.controls['id'].value > 0) {
      this.loading = true;
      this._api.postTypeRequest('profile/edit-product-image', this.dataForm.value).subscribe({
        next: (res: any) => {
          this.loading =  false;
          if(res.status == 1){
            //Accedió a la base de datos y no hubo problemas
            if(res.changedRows == 1){
              //Modificó la imagen
              this._notify.showSuccess('La imagen del producto se ha modificado con éxito!');
              this.changeDetected.emit(true);
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
