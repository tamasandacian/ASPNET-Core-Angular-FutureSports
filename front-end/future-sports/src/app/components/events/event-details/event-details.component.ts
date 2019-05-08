import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';
import { Response } from '@angular/http';

//Google Map
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { MapConfig } from '../../../map-config';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../../services/alert.service';
import { User } from '../../../model/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})

export class EventDetailsComponent implements OnInit {

  private eventId: any;
  public eventDetails: any;
  public userParticipants: any;
  public categoryId: string;

  showSelected: boolean;
  showParticipateButton: boolean;

  public id: any;

  //Google Map
  public latitude: number;
  public longitude: number;
  public zoom: number;

  // Google Map Style
  public customStyle;

  // Get User Participation Details
  public user: any;
  public userId: any;
  public loggedUserId: any;
  public firstName: any;
  public lastName: any;
  public userName: any;


  public popoverTitle: string = 'Confirmation';
  public popoverMessage: string = 'Do you want to leave from this activity?';

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private mapConfig: MapConfig,
    private toastr: ToastrService,
    private alertService: AlertService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.eventId = params['id'];
    });

  }



  ngOnInit() {

    this.zoom = 15;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    this.customStyle = this.mapConfig.customStyle;

    this.getAllParticipants();

    this.eventService.getEventDetails(this.eventId).subscribe(
      detail => {
        this.eventDetails = detail;
        this.categoryId = detail.categoryId;
      });

  }


  getAllParticipants() {
    this.eventService.getAllUsersForEvent(this.eventId).subscribe(userList => {
      this.userParticipants = userList;

      console.log("Users are: " + JSON.stringify(this.userParticipants));


      for (let key in this.userParticipants) {
        if (!this.userParticipants.hasOwnProperty(key)) {
          //If the current property is not a direct property of this.eventList
          continue;
        }
        else {
          let currentLoggedUser = sessionStorage.getItem('userId');
          //Do your logic with the property here
          console.log(key + " -> " + JSON.stringify(this.userParticipants[key]));
          let someObject = this.userParticipants[key];
          console.log("loggedin: " + currentLoggedUser);
          console.log("user events: " + someObject.userEvents.length);
        
          if (someObject.id == currentLoggedUser){
            this.showParticipateButton = false;
            this.showSelected = true;
          }
          else {
            this.showParticipateButton = true;
            this.showSelected = false;
          }
        }
      }

      let userParticipate: boolean = false;
    
    });
  }

  participate() {

    console.log("Confirmed button clicked!")

    this.loggedUserId = sessionStorage.getItem('userId');
    let eventId = this.eventId;

    var object = {
      eventId: eventId,
      userId: this.loggedUserId,
      categoryId: this.categoryId
    }

    this.eventService.participate(object).subscribe(eventDetails => {
      this.getAllParticipants();
     // sessionStorage.removeItem('userId');
      this.alertService.success('You have successfully enrolled to this activity!')
    },

      error => {
        this.alertService.error(error._body);
      }
    );
  }

  cancelClicked() {
    console.log("Cancel Button Clicked!")
    this.alertService.error('Participation interrupted!')
  }

  public unparticipate() {

    let userId = sessionStorage.getItem('userId');
    let eventId = this.eventId;
   
    var object = {
      eventId: eventId,
      userId: userId,
      categoryId: this.categoryId
    }

    this.eventService.unparticipate(object).subscribe(userParticipants => {
      this.getAllParticipants();
      //sessionStorage.removeItem('userId');
      this.alertService.success('Sorry that you changed your mind :(! You can come back anytime!')
    },

      error => {
        this.alertService.error(error._body);
        //  this.loading = false;
      }
    );

  }



  getEventDetails() {
    this.eventService.getEventDetails(this.eventId).subscribe(
      detail => {
        this.eventDetails = detail;
        // console.log("Event Details here: " + JSON.stringify(this.eventDetails));
      });
  }

  // Display Markers from Database
  convertStringToNumber(value: string): number {
    return +value;
  }
}
