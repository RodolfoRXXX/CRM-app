import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ConectorsService } from '../services/conectors.service';


  //Guard para evitar acceso a sector: "editar detalles de la empresa" en settings
  export const is_eddle_settings: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isEddleSettings();
    };

  const isEddleSettings = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _router  = inject(Router);
    const _conector = inject(ConectorsService);

    return _conector.getEmployee().pipe(
      map(value => {
        const permissions = value.list_of_permissions.split(',').includes('1');
        if (!permissions) {
          return _router.createUrlTree(['init/settings/index']); // Redirige a la ruta 'index'
        }
        return true; // Devuelve true si tiene el permiso '1'
      })
    );
  }

  //Guard para evitar acceso a sector: "editar permisos y roles" en settings
  export const is_epyr_settings: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isEpyrSettings();
    };

  const isEpyrSettings = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _router  = inject(Router);
    const _conector = inject(ConectorsService);

    return _conector.getEmployee().pipe(
      map(value => {
        const permissions = value.list_of_permissions.split(',').includes('3');
        if (!permissions) {
          return _router.createUrlTree(['init/settings/index']); // Redirige a la ruta 'index'
        }
        return true; // Devuelve true si tiene el permiso '3'
      })
    );
  }

  //Guard para evitar acceso a sector: "ver estado de cuenta" en settings
  export const is_vedc_settings: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isVedcSettings();
    };

  const isVedcSettings = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _router  = inject(Router);
    const _conector = inject(ConectorsService);

    return _conector.getEmployee().pipe(
      map(value => {
        const permissions = value.list_of_permissions.split(',').includes('2');
        if (!permissions) {
          return _router.createUrlTree(['init/settings/index']); // Redirige a la ruta 'index'
        }
        return true; // Devuelve true si tiene el permiso '2'
      })
    );
  }
