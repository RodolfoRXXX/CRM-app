import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Product } from 'src/app/shared/interfaces/product.interface';
import { environment } from 'src/enviroments/enviroment';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.scss']
})
export class ProductImageComponent {

  @Input() product!: Product;

  isDragOver = false;
  imageSrc: string | ArrayBuffer | null = null;
  dataForm!: FormGroup;
  load!: boolean;
  uriImg = environment.SERVER;

  //Toma los cambios del Input de entrada y actualiza la data
  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      console.log(changes['product'].currentValue)
      this.imageSrc = this.uriImg + changes['product'].currentValue.image
    }
  }

  //Formulario edición de imágen de producto
  createDataForm(): void {
    this.dataForm = new FormGroup({
        id: new FormControl(''),
        image: new FormControl('')
    });
  }

  //Setea los valores del formulario
  SetDataForm(product: Product) {

  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
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
    reader.onload = (e) => {
      //this.imageSrc = e.target?.result;
    };
    reader.readAsDataURL(file);
  }

}
