import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

  //Guard para cuidar rutas de usuarios no logueados
  export const auth_logged: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isLogged();
    };

  const isLogged = () : | boolean | UrlTree | Observable<boolean | UrlTree > | Promise<boolean | UrlTree > => {
    const _authSvc = inject(AuthService);
    const _router  = inject(Router);
    return _authSvc.isLogged$.pipe(
      tap( (isLogged : boolean) => {
        if(!isLogged) {
          _router.navigate(['login']);
        }
      } )
    )
  }

  //Guard para cuidar rutas de usuarios no autenticados
  export const auth_authenticated: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isAuthenticated();
    };

  const isAuthenticated = () : | boolean | UrlTree | Observable<boolean | UrlTree > | Promise<boolean | UrlTree > => {
    const _authSvc = inject(AuthService);
    const _router  = inject(Router);
    return _authSvc.isAuthenticated$.pipe(
      tap( (isAuthenticated : boolean) => {
        if(!isAuthenticated) {
          _router.navigate(['recharge']);
        }
      } )
    )
  }
