import { Component, OnInit, Input, PipeTransform, Pipe } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../../services/event.service';
import { MapTypeStyle } from '@agm/core';
import { Http } from '@angular/http';
import { validateConfig } from '@angular/router/src/config';
import { WeatherService } from '../../../services/weather.service';
import 'rxjs/add/operator/map';
import { Response } from '@angular/http';
import { MapConfig } from '../../../map-config';
import { User } from '../../../model/user';

import { AppConfig } from '../../../app-config';
import { DateFormatter } from 'ngx-bootstrap/datepicker';
import { ModalDirective } from 'ngx-bootstrap';
import { GoogleMapComponent } from '../../google-map/google-map.component';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit{

  public latitude: number;
  public longitude: number;

  // Get Value from DropdownList
  public selectCat: any;
  public selectExp: any;

  // Location Info
  public street_address: string;
  public zipCode: string;
  public country: string;
  public country_code_name: string;

   // Display Events
   public eventList = [];

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
    clearBtn:true
}


  // Display Dropdown List Categories & Experiences
  public CategoryList = [];
  public ExperienceList = [];

  @ViewChild('closeAddExpenseModal')
  public closeAddExpenseModal: ElementRef;
  public formData: FormGroup;

  // Access Bootstrap Modal in Navigation Bar
  @ViewChild('childModal') public childModal:ModalDirective;

  // Get Address from Google Autocomplete
  @ViewChild("search") 
  public mainSearchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private http: Http,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private mapConfig: MapConfig,
    private appConfig: AppConfig,
    private eventService: EventService,
    private weatherService: WeatherService,
    private fb: FormBuilder
  ) { 

    this.eventService.getCategories()
      .subscribe(data => {
        this.CategoryList = data.json();
      });

    this.eventService.getExperiences()
      .subscribe(data => {
        this.ExperienceList = data.json();
      });

    this.formData = new FormGroup({
      'date': new FormControl('', Validators.required),
      'start': new FormControl('', Validators.required),
      'end': new FormControl('', Validators.required),
      'Address': new FormControl('', Validators.required),
      'MaxNoOfPlayers': new FormControl(0, Validators.required),
      'Experience': new FormControl(0, [Validators.required, this.customValidator]),
      'Category': new FormControl(0, [Validators.required, this.customValidator]),
      
    });
  }

  ngOnInit() {

  }

  // Input Validation
  customValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value == "0") {
      return { data: true }
    } else {
      return null;
    }
  }

 // Display Bootstrap Modal In Navigation Bar on button click
  show(){
    this.childModal.show();
  }
  hide(){
    this.childModal.hide();
  }

  getEvents() {
    this.eventService.getEventList().subscribe(
      events => {
        this.eventList = events;
        console.log("Events here:" + JSON.stringify(this.eventList));
      }
    );
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

  submitData() {

    let userId = sessionStorage.getItem('userId');
    console.log("USER ID IS: " + userId)

    // Datepicker Value
    let datePicker = this.formData.get('date').value;

    // Timepicker
    let time1 = this.formData.get('start').value;
    let time2 = this.formData.get('end').value;

    console.log("Date is: " + datePicker);
    console.log("Time1 is: " + time1);
    console.log("Time2 is: " + time2);
    let maxPlayers = this.formData.get('MaxNoOfPlayers').value;

    console.log("MaxnoOfPlayers " + maxPlayers);

    console.log("Address " + this.street_address);
    var jsonString1 = JSON.stringify(this.latitude);
    var jsonString2 = JSON.stringify(this.longitude);


    if (this.formData.valid) {

      var lat = parseFloat(jsonString1);
      var long = parseFloat(jsonString2);

      var object1 = {
        Date: datePicker,
        Start: time1,
        End: time2,
        CategoryId: this.selectCat,
        ExperienceId: this.selectExp,

        Latitude: parseFloat(jsonString1),
        Longitude: parseFloat(jsonString2),

        Address: this.street_address,
        CountryCode: this.country_code_name,
        CountryName: this.country,
        ZipCode: this.zipCode,
        UserIds: userId,
        MaxNoOfPlayers: maxPlayers
      }

      var object2 = { userId: userId }


      var data = {
        object1: object1,
        object2: object2
        //userId: this.userId
      };

      this.eventService.postData(data).subscribe(events => this.getEvents());
      localStorage.removeItem('userId');
      this.toastr.success('New Event Created Successfully!', 'Success!');
      this.formData.reset();
      this.closeAddExpenseModal.nativeElement.click();
    }
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        //this.zoom = 12;

      });
    }
  }

}
