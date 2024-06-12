import { Component } from '@angular/core';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.scss']
})
export class ProductImageComponent {

  isDragOver = false;
  imageSrc: string | ArrayBuffer | null = null;
  load!: boolean;

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
