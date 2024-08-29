// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  URL : 'http://localhost:4000/',
  SERVER : 'http://localhost:4000/uploads/',
  //URL : 'https://www.vibrance.com.ar/',
  //SERVER : 'https://www.vibrance.com.ar/uploads/',
};

export const permissions = {
  EDIT_ENTERPRISE_CONTROL : '1',
  EDIT_EMPLOYEE_CONTROL : '2',
  EDIT_PROVIDER_CONTROL : '5',
  EDIT_PRODUCT_CONTROL : '6',
}