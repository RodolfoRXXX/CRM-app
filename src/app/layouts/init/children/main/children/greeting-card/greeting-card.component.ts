import { Component, OnInit } from '@angular/core';

const accessKey = "UEQmxWZYPVOabAGUhmDN99oxVIocE0PlKD8lWwXRFYU";
const endPoint = 'https://api.unsplash.com/photos/random';

interface UnsplashImage {
  id: string;
  urls: {
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    download_location: string;
  };
}

@Component({
  selector: 'app-greeting-card',
  templateUrl: './greeting-card.component.html',
  styleUrls: ['./greeting-card.component.scss']
})
export class GreetingCardComponent implements OnInit {

  img!: UnsplashImage;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() { }

  ngOnInit(): void {
    //this.loadImage();
  }

  async loadImage() {
    this.isLoading = true;
    this.error = null;
    let query = 'morning';
    try {
      const response = await fetch(`${endPoint}?client_id=${accessKey}&orientation=squarish&query=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const jsonResponse = await response.json();
      this.img = jsonResponse;

      // Trigger download
      await fetch(`${this.img.links.download_location}?client_id=${accessKey}`, {
        method: 'GET'
      });

      console.log(this.img);  // Aquí puedes manejar la imagen como lo necesites
    } catch (error) {
      this.error = 'There was a problem with the fetch operation: ' + error;
      console.error(this.error);
    } finally {
      this.isLoading = false;
    }
  }
}




