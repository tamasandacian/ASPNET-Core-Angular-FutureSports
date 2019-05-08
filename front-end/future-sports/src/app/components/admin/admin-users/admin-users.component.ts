import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  
  userList: any[];

  constructor(private userService: UserService) { }

  ngOnInit() {
   this.getUsers();
  }

  getUsers(){
    this.userService.getAll().subscribe(users => {
      this.userList = users;
    });
  }

}
