import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthAdminGuardService {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (sessionStorage.getItem('isAdmin') == "true") {
      // logged in so return true
      return true;
    }

    else {
      // if not logged in as admin so redirect to unauthorized page with the return url
      this.router.navigate(['unauthorized'], { queryParams: { returnUrl: state.url } });
      return false;
    }

  }

}
