import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ConectorsService } from '../services/conectors.service';
import { environment } from 'src/environments/environment';

const edit_enterprise_control = environment.EDIT_ENTERPRISE_CONTROL;

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
        const permissions = value.list_of_permissions.split(',').includes(edit_enterprise_control);
        if (!permissions) {
          return _router.createUrlTree(['init/settings/index']); // Redirige a la ruta 'index'
        }
        return true; // Devuelve true si tiene el permiso '1'
      })
    );
  }
