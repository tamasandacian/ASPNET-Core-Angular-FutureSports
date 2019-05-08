import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../model/user';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateEventComponent } from '../../components/events/create-event/create-event.component';
import { Location } from '@angular/common';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser: User;
  isAuthenticated: boolean;
  public isAuthenticated$ = this.auth.isAuthenticated$;


  @ViewChild('childModal') childModal: CreateEventComponent;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private modalService: BsModalService,
    private location: Location,
    private alertService: AlertService
  ) { }

  ngOnInit() {
   
    this.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated = authenticated;
      if (authenticated) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if(this.currentUser.isAdmin == 'true'){
          
        }
      } else {
        this.currentUser = null;
      }
    });
  }

  logOut() {
    this.auth.logout();
    this.alertService.success("You have successfully logged out!", true);
    this.router.navigate(['/login']);
  }
}
