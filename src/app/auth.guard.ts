import { Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, 
				private router: Router) 
	{ }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> 
	{
		return this.authService.canActivateProtectedRoutes$
      		.pipe(tap(x => console.log('You tried to go to ' + state.url + ' and this guard said ' + x)));
	}
}
