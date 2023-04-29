import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, pipe, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

  //Guard para cuidar rutas de usuarios no logueados
  export const is_logged: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isLogged();
    };

  const isLogged = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
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
  export const is_authenticated: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isAuthenticated();
    };

  const isAuthenticated = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
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

  //Guard para cuidar rutas de login-register-forgot-recover
  export const isNot_logged: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isNotLogged();
    };

  const isNotLogged = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _authSvc = inject(AuthService);
    const _router  = inject(Router);
    const state = _authSvc.isLogged$;
    const change_sign = pipe(
      map( (value:boolean) => value = (value !== true)),
      tap( (value:boolean) => (!value)?_router.navigate(['recharge']):'' )
    );
    const fx = change_sign(state);
    return fx;
  }

  //Guard para cuidar rutas de recharge
  export const isNot_authenticated: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isNotAuthenticated();
    };

  const isNotAuthenticated = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _authSvc = inject(AuthService);
    const _router  = inject(Router);
    const state = _authSvc.isAuthenticated$;
    const change_sign = pipe(
      map( (value:boolean) => value = (value !== true)),
      tap( (value:boolean) => (!value)?_router.navigate(['init']):'' )
    );
    const fx = change_sign(state);
    return fx;
  }

  //Guard para cuidar ruta de usuarios no activos
  export const is_active: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isActive();
    };

  const isActive = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _authSvc = inject(AuthService);
    const _router  = inject(Router);
    return _authSvc.isActive$.pipe(
      tap( (isActive : boolean) => {
        if(!isActive) {
          _router.navigate(['blocked']);
        }
      } )
    )
  }

  //Guard para cuidar la ruta init si el usuario no está activo
  export const isNot_active: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isNotActive();
    };

  const isNotActive = () : | boolean | UrlTree | Observable< boolean | UrlTree > | Promise< boolean | UrlTree > => {
    const _authSvc = inject(AuthService);
    const _router  = inject(Router);
    const state = _authSvc.isActive$;
    const change_sign = pipe(
      map( (value:boolean) => value = (value !== true)),
      tap( (value:boolean) => (!value)?_router.navigate(['init']):'' )
    );
    const fx = change_sign(state);
    return fx;
  }