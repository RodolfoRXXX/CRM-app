import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ConectorsService } from '../services/conectors.service';
import { environment } from 'src/environments/environment';

const edit_provider_control = environment.EDIT_PROVIDER_CONTROL;
const edit_product_control = environment.EDIT_PRODUCT_CONTROL;

  //Guard para evitar acceso a sector: "editar detalles de la empresa" en main
  export const is_eddla_main: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isEddlaMain();
    };

  const isEddlaMain = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _router  = inject(Router);
    const _conector = inject(ConectorsService);

    return _conector.getEmployee().pipe(
      map(value => {
        const permissions = value.list_of_permissions.split(',').includes(edit_product_control);
        if (!permissions) {
          return _router.createUrlTree(['init/main/dashboard']); // Redirige a la ruta 'dashboard'
        }
        return true; // Devuelve true si tiene el permiso '1'
      })
    );
  }

  //Guard para evitar acceso a sector: "Editar productos del catálogo"
  export const is_epdc: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isEpdc();
    };

  const isEpdc = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _router  = inject(Router);
    const _conector = inject(ConectorsService);

    return _conector.getEmployee().pipe(
      map(value => {
        const permissions = value.list_of_permissions.split(',').includes(edit_product_control);
        if (!permissions) {
          return _router.createUrlTree(['init/main/dashboard']); // Redirige a la ruta 'dashboard'
        }
        return true; // Devuelve true si tiene el permiso '6'
      })
    );
  }

  //Guard para evitar acceso a sector: "Ver información sensible de proveedores"
  export const is_visdp: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isVisdp();
    };

  const isVisdp = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _router  = inject(Router);
    const _conector = inject(ConectorsService);

    return _conector.getEmployee().pipe(
      map(value => {
        const permissions = value.list_of_permissions.split(',').includes(edit_provider_control);
        if (!permissions) {
          return _router.createUrlTree(['init/main/dashboard']); // Redirige a la ruta 'dashboard'
        }
        return true; // Devuelve true si tiene el permiso '5'
      })
    );
  }
