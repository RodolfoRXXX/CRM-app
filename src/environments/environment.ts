// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { GLOBAL } from "./globals";

export const environment = {
  production: false,
  ...GLOBAL,
  URL : 'http://localhost:4000/',
  SERVER : 'http://localhost:4000/uploads/',
  //URL : 'https://www.vibrance.com.ar/',
  //SERVER : 'https://www.vibrance.com.ar/uploads/',
};