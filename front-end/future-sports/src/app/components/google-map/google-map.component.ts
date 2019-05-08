import { Component, OnInit, Input, PipeTransform, Pipe } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../services/event.service';
import { MapTypeStyle } from '@agm/core';
import { Http } from '@angular/http';
import { validateConfig } from '@angular/router/src/config';
import { WeatherService } from '../../services/weather.service';
import 'rxjs/add/operator/map';
import { Response } from '@angular/http';
import { MapConfig } from '../../map-config';
import { User } from '../../model/user';

import { AppConfig } from '../../app-config';
import { DateFormatter } from 'ngx-bootstrap/datepicker';
import { GoogleMapService } from '../../services/google-map.service';
import { forEach } from '@angular/router/src/utils/collection';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css'],

})
export class GoogleMapComponent implements OnInit {

  getDate(dt: Date): number {
    return dt && dt.getTime();
  }

  date3: Date;

  currentUser: User;
  // User Participating
  public eventId: any;
  public categoryId: any;
  public userParticipants: any;

  public popoverTitle: string = 'Confirmation';
  public popoverMessage: string = 'Do you want to participate in this activity?';


  // Trigger Markers on click list
  public infoWindowOpen: boolean = false;

  showSelected: boolean;
  showParticipateButton: boolean;

  // TimePicker & DatePicker
  date: Date = new Date(2018, 7, 3);
  start: Date = new Date();
  end: Date = new Date();

  datepickerOpts = {
    startDate: new Date(2016, 5, 10),
    autoclose: true,
    todayBtn: 'linked',
    todayHighlight: true,
    assumeNearbyYear: true,
    format: 'D, d MM yyyy',
    clearBtn: true
  }


  _date = new Date();

  // Google Map
  public latitude: number;
  public longitude: number;
  public zoom: number;

  // Display Events
  public eventList: any = [];

  // Display Weather
  public weather: Weather;
  public weatherSearch: Weather;

  // Location Info
  public street_address: string;
  public zipCode: string;
  public country: string;
  public country_code_name: string;

  // Get Value from DropdownList
  public selectCat: any;
  public selectExp: any;
  public maxNoOfPlayers: number;
  public selectCatDropbox: any;

  public autocomplete: any;

  // Google Map Style
  public customStyle;

  @Input()
  imgPath: string = "http://openweathermap.org/img/w/";
  imgFileName: string = ".png";


  searchBox: any;
  enableFilter = false;

  // Create Event
  public CategoryList = [];
  public ExperienceList = [];
  public formData: FormGroup;

  @ViewChild("mainSearch") mainSearchElementRef: ElementRef
  @ViewChild("search") searchElementRef: ElementRef;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private weatherService: WeatherService,
    private http: Http,
    private mapConfig: MapConfig,
    private appConfig: AppConfig,
    private googleMapService: GoogleMapService,
    private alertService: AlertService

  ) {

    this.formData = new FormGroup({
      'date': new FormControl('', Validators.required),
      'start': new FormControl('', Validators.required),
      'end': new FormControl('', Validators.required),
      'Address': new FormControl('', Validators.required),
      'MaxNoOfPlayers': new FormControl(0, Validators.required),
      'Experience': new FormControl(0, [Validators.required, this.customValidator]),
      'Category': new FormControl(0, [Validators.required, this.customValidator]),
    });

    this.eventService.getCategories()
      .subscribe(data => {
        this.CategoryList = data.json();
      });

    this.eventService.getExperiences()
      .subscribe(data => {
        this.ExperienceList = data.json();
      });



    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      var options = {
        // types: ['establishment']
      };


      let autocomplete = new google.maps.places.Autocomplete(this.mainSearchElementRef.nativeElement);

      autocomplete.addListener("place_changed", () => {

        this.ngZone.run(() => {

          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();



          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          let weather_lat = this.latitude;
          this.longitude = place.geometry.location.lng();
          let weather_long = this.longitude;
          //this.googleMapService.zoom = 15;

          // console.log("place  = " + JSON.stringify(place));

          var curr_address_components = place.address_components;


          for (var i = 0; i < curr_address_components.length; i++) {
            var curr_types = curr_address_components[i].types;

            for (var j = 0; j < curr_types.length; j++) {
              if (curr_types[j] == "postal_code") {
                this.zipCode = curr_address_components[i].short_name;
                // console.log("Zip Cooooode1: " + this.zipCode);
              }

              if (curr_types[j] == "country") {
                this.country_code_name = curr_address_components[i].short_name;
              }

              if (curr_types[j] == "country") {
                this.country = curr_address_components[i].long_name;
              }

            }
          }

          //Get Location Info from Search Autocomplete
          // console.log("Zip Code:" + this.zipCode);

          this.street_address = place.formatted_address;
          // console.log("Address1:" + this.street_address);
          this.getWeatherFromSearch(Number(this.zipCode), this.country_code_name);
        });
      });
    });


    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      var options = {
        // types: ['establishment']
      };


      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

      autocomplete.addListener("place_changed", () => {

        this.ngZone.run(() => {

          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();



          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          let weather_lat = this.latitude;
          this.longitude = place.geometry.location.lng();
          let weather_long = this.longitude;
          this.zoom = 11;
          // console.log("place  = " + JSON.stringify(place));

          var curr_address_components = place.address_components;


          for (var i = 0; i < curr_address_components.length; i++) {
            var curr_types = curr_address_components[i].types;

            for (var j = 0; j < curr_types.length; j++) {
              if (curr_types[j] == "postal_code") {
                this.zipCode = curr_address_components[i].short_name;
                //  console.log("Zip Cooooode1: " + this.zipCode);
              }

              if (curr_types[j] == "country") {
                this.country_code_name = curr_address_components[i].short_name;
              }

              if (curr_types[j] == "country") {
                this.country = curr_address_components[i].long_name;
              }

            }
          }

          //Get Location Info from Search Autocomplete
          //console.log("Zip Code:" + this.zipCode);

          this.street_address = place.formatted_address;
          // console.log("Address1:" + this.street_address);
          this.getWeatherFromSearch(Number(this.zipCode), this.country_code_name);
        });
      });
    });

  }

  ngOnInit() {

    this.zoom = 1;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    this.customStyle = this.mapConfig.customStyle;



    this.getEvents();

    this.setCurrentPosition();

  }



  customValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value == "0") {
      return { data: true }
    } else {
      return null;
    }
  }

  selectCategory(value) {
    console.log(value);
    this.selectCat = value;
    console.log("Selected Value of Category is: " + this.selectCat);
  }

  selectExperience(value) {
    console.log(value);
    this.selectExp = value;
    console.log("Selected Value of Experience is: " + this.selectExp);
  }

  getEvents() {
    this.eventService.getEventList().subscribe(
      events => {

        this.eventList = events;


        for (let key in this.eventList) {
          if (!this.eventList.hasOwnProperty(key)) {
            //If the current property is not a direct property of this.eventList
            continue;
          }
          else {

            let user = JSON.parse(localStorage.getItem('currentUser'));
            let currentLoggedUser = user.id

            //Do your logic with the property here
            console.log(key + " -> " + JSON.stringify(this.eventList[key]));
            let eventObject = this.eventList[key];

            this.eventId = eventObject.id;
            this.categoryId = eventObject.categoryId;


            if (eventObject.userIds.indexOf(currentLoggedUser) !== -1) {
              console.log("DA")
              this.showParticipateButton = false;
              this.showSelected = true;

            }
            else {
              console.log("NU")
              this.showParticipateButton = true;
              this.showSelected = false;
            }

          }
        }
      }

    );
  }

  // Display Markers from Database
  private convertStringToNumber(value: string): number {
    return +value;
  }

  public getWeatherFromSearch(zip_code, country_name) {
    this.zipCode = zip_code;
    this.country_code_name = country_name;
    this.http.get(this.appConfig.apiUrl + '/api/Weather/city/' + this.zipCode + '/' + this.country_code_name)
      .subscribe(result => {
        this.weather = result.json();
        console.log("Weather is: " + JSON.stringify(this.weather));
      });
  }


  // Event Participating
  confirmClicked() {

    console.log("Confirmed button clicked!")

    let user = JSON.parse(localStorage.getItem('currentUser'));

    let currentLoggedUser = user.id

    let eventId = this.eventId;

    console.log("Event id: " + eventId)
    console.log("User id is: " + currentLoggedUser);


    var object = {
      eventId: eventId,
      userId: currentLoggedUser,
      categoryId: this.categoryId
    }


    this.eventService.participate(object).subscribe(eventDetails => {
      this.getEvents();

      // sessionStorage.removeItem('userId');
      this.alertService.success('You have successfully enrolled to this activity!')
    },
      error => {
        this.alertService.error(error._body);
        //  this.loading = false;
      }
    );
  }

  cancelClicked() {
    console.log("Cancel Button Clicked!")
    this.alertService.error('Participation interrupted!')
  }


  //Unparticipate
  public unparticipate() {

    let user = JSON.parse(localStorage.getItem('currentUser'));

    let currentLoggedUser = user.id

    let eventId = this.eventId;

    var object = {
      eventId: eventId,
      userId: currentLoggedUser,
      categoryId: this.categoryId
    }

    this.eventService.unparticipate(object).subscribe(userParticipants => {
      this.getEvents();
      //sessionStorage.removeItem('userId');
      // this.showSelected = false;


      this.alertService.success('Sorry that you changed your mind :(! You can come back anytime!')
    },

      error => {
        this.alertService.error(error._body);
        //  this.loading = false;
      }
    );

  }



  getAllParticipants() {
    this.eventService.getAllUsersForEvent(this.eventId).subscribe(userList => this.userParticipants = userList);
  }



  // Create New Sport Activity
  createEvent() {

    let userId = sessionStorage.getItem('userId');

    // Datepicker Value
    let datePicker = this.formData.get('date').value;

    // Timepicker
    let time1 = this.formData.get('start').value;
    let time2 = this.formData.get('end').value;
    let maxPlayers = this.formData.get('MaxNoOfPlayers').value;
    var jsonString1 = JSON.stringify(this.latitude);
    var jsonString2 = JSON.stringify(this.longitude);


    if (this.formData.valid) {

      var lat = parseFloat(jsonString1);
      var long = parseFloat(jsonString2);

      if (this.zipCode == undefined) {

      } else {

        var object = {
          date: datePicker,
          start: time1,
          end: time2,
          categoryId: this.selectCat,
          experienceId: this.selectExp,

          latitude: parseFloat(jsonString1),
          longitude: parseFloat(jsonString2),

          address: this.street_address,
          countryCode: this.country_code_name,
          countryName: this.country,
          zipCode: this.zipCode,
          maxNoOfPlayers: maxPlayers,
          userId: userId

        }
      }

      this.eventService.postData(object).subscribe(events => {
        this.getEvents();
        //sessionStorage.removeItem('userId');
        this.toastr.success('New Event Created Successfully!', 'Success!');
        this.formData.reset();
        this.closeAddExpenseModal.nativeElement.click();
      },
        error => {
          this.alertService.error(error._body);
          //  this.loading = false;
        });
      //

    }
  }


  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;

      });
    }
  }
}


