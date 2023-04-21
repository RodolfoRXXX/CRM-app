import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

  export const auth_login: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return isAuthenticated();
    };

  const isAuthenticated = () : | boolean | UrlTree | Observable<boolean | UrlTree > | Promise<boolean | UrlTree > => {
    const _authSvc = inject(AuthService);
    const _router  = inject(Router);
    return _authSvc.isAuthenticated$.pipe(
      tap( (isAuthenticated : boolean) => {
        if(!isAuthenticated) {
          _router.navigate(['login']);
        }
      } )
    )
  }

