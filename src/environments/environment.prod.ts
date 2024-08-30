import { GLOBAL } from "./globals";

export const environment = {
    production: true,
    ...GLOBAL,
    URL : 'http://localhost/',
    SERVER : 'http://localhost/uploads/',
    //URL : 'https://www.vibrance.com.ar/',
    //SERVER : 'https://www.vibrance.com.ar/uploads/',
  };