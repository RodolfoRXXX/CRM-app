import { GLOBAL } from "./globals";

export const environment = {
    production: true,
    ...GLOBAL,
    URL : 'http://localhost:4000/',
    SERVER : 'http://localhost:4000/uploads/',
    //URL : 'https://www.vibrance.com.ar/',
    //SERVER : 'https://www.vibrance.com.ar/uploads/',
  };