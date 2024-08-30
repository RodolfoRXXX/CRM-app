// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { GLOBAL } from "./globals";

export const environment = {
  production: false,
  ...GLOBAL,
  //URL : 'http://localhost:4000/',
  //SERVER : 'http://localhost:4000/uploads/',
  URL : 'http://149.50.142.198:4000/',
  SERVER : 'http://149.50.142.198:4000/uploads/',
};