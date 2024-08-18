import { Component, OnInit } from '@angular/core';
import { ConectorsService } from 'src/app/services/conectors.service';
import { UnsplashImage } from 'src/app/shared/interfaces/unsplashImage.interface';

const ACCESS_KEY = 'UEQmxWZYPVOabAGUhmDN99oxVIocE0PlKD8lWwXRFYU';
const ENDPOINT = 'https://api.unsplash.com/photos/random';
const QUERY = 'calm,nature,peace'; 

@Component({
  selector: 'app-greeting-card',
  templateUrl: './greeting-card.component.html',
  styleUrls: ['./greeting-card.component.scss']
})
export class GreetingCardComponent implements OnInit {

  img!: UnsplashImage;
  name!: string;
  day!: string;
  imgType!: string;
  error: string | null = null;

  constructor(
    private _conector: ConectorsService,
  ) { }

  ngOnInit(): void {
    this.day = this.getHour();
    this.loadImage();
    this.getDataLocal();
  }

  //Función que obtiene los datos del usuario logueado
  private getDataLocal() {
    this._conector.getEmployee().subscribe((item: any) => {
      if(item.name.length) {
        this.name = item.name.split(" ")[0];
      }else {
        this.name = item.email.split("@")[0];
      }
    });
  }

  //Función que obtiene el momento del día en el que se encuentra
  private getHour(): string {
    const hours = new Date().getHours();
    if (hours >= 20 || hours < 6) {
      this.imgType = 'night'
      return 'Buenas noches';
    } else if (hours >= 6 && hours < 12) {
      this.imgType = 'morning'
      return 'Buen día';
    } else if (hours >= 12 && hours < 20) {
      this.imgType = 'afternoon'
      return 'Buenas tardes';
    } else {
      this.imgType = 'morning'
      return 'Buen día'
    }
  }

  //Función que carga la imagen de Unsplash
  async loadImage() {
    const currentHour = new Date().getHours();
    const storedHour = localStorage.getItem('storedHour');

    if (storedHour && parseInt(storedHour, 10) === currentHour && localStorage.getItem('imageData')) {
      this.img = JSON.parse(localStorage.getItem('imageData')!);
      return;
    }

    this.error = null;
    try {
      let alt_query = QUERY + ',' + this.imgType;
      const response = await fetch(`${ENDPOINT}?client_id=${ACCESS_KEY}&orientation=landscape&query=${alt_query}&color=#00695c`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const jsonResponse = await response.json();
      this.img = jsonResponse;
      // Trigger download
      await fetch(`${this.img.links.download_location}?client_id=${ACCESS_KEY}`, {
        method: 'GET'
      });

      // Almacena la imagen y la hora actual en localStorage
      localStorage.setItem('imageData', JSON.stringify(this.img));
      localStorage.setItem('storedHour', currentHour.toString());
    } catch (error) {
      this.error = 'There was a problem with the fetch operation: ' + error;
    }
  }
}
