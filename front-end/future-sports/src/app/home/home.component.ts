import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../model/user';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  currentUser: User;
  users: User[] = [];

  public constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService 
  ) {

   }

  ngOnInit() {
    this.loadAllUsers();
  }

  public loadAllUsers(){
    this.userService.getAll().subscribe(users => { this.users = users });
  }

  deleteUser(_id: string){
    this.userService.delete(_id).subscribe(() => {this.loadAllUsers()});
  }

  logOut(){
    this.authenticationService.logout();
  }

}
