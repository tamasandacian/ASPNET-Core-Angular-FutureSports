import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppConfig } from '../app-config';
import { AlertService } from './alert.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../model/user';
import { Subject } from "rxjs/Subject";
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class AuthenticationService {

  //user: User;
  isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: Http, 
    private config: AppConfig,
    private alertService: AlertService
  ) {
    const authenticated = !!JSON.parse(localStorage.getItem('currentUser'));
    this.isAuthenticated$.next(authenticated);
  }

  login(username: string, password: string) {
    return this.http.post(this.config.apiUrl + '/api/User/', { username: username, password: password })
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let user = response.json();

        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
         // localStorage.setItem('user_id', JSON.stringify(user));
          
          sessionStorage.setItem('isAdmin', user.isAdmin);
          sessionStorage.setItem('userId', user.id);
          
          this.isAuthenticated$.next(true);
        }
      });
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    this.isAuthenticated$.next(false);
  }

}
