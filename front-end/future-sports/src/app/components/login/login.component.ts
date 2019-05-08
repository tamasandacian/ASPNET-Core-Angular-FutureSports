import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { AlertService } from '../../services/alert.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          
          if (sessionStorage.getItem('isAdmin') == "true") {
            this.alertService.success("You have successfully logged in to Admin Panel!", true);
            this.router.navigate(['admin/users']);
          }
          else {
            this.alertService.success("You have successfully logged in to Future Sports!", true);
            this.router.navigate([this.returnUrl]);
          }

        },
        error => {
          this.alertService.error(error._body);
          this.loading = false;
        });
  }

}





