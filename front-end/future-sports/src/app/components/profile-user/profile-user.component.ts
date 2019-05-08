import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.css']
})
export class ProfileUserComponent implements OnInit {

  private username: any;
  public userEvents: any;
  public event: Events;
  public user: any;
  public docs: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.username = params['username'];
    });

  }

  IsHidden = true;
  isHidden = true;

  onSelect() {
    this.IsHidden = !this.IsHidden;
  }

  onSelectSecond() {
    this.isHidden = !this.isHidden;
  }


  ngOnInit() {

    this.userService.getByUsername(this.username).subscribe(user => {
      this.user = user;
    });

    this.getAllEvents();

  }

  getAllEvents() {
    this.userService.getAllEventsForUsers(this.username).subscribe(eventList => {
      this.userEvents = eventList;
    });


  }


}
