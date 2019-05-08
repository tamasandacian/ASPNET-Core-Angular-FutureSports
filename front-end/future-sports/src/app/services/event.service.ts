import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map';
import { Response } from '@angular/http';
import { AppConfig } from '../app-config';

@Injectable()
export class EventService {

  events = [];

  constructor(
    private http: Http,
    private appConfig: AppConfig
  ) { }

  getEventList() {
    return this.http.get(this.appConfig.apiUrl + '/api/Events')
      .map((res) => res.json());
  }

  getCategories() {
    return this.http.get(this.appConfig.apiUrl + '/api/Categories');
  }

  getExperiences() {
    return this.http.get(this.appConfig.apiUrl + '/api/Experiences');
  }

  getEventDetails(eventId: any) {
    return this.http.get(this.appConfig.apiUrl + '/api/Events/GetEventById/' + eventId)
      .map((res: Response) => res.json());
  }

  getAllUsersForEvent(eventId: any) {
    return this.http.get(this.appConfig.apiUrl + '/api/Events/GetAllParticipants/' + eventId)
      .map((res: Response) => res.json());
  }

  postData(data: any): Observable<Response> {
    let headers = new Headers({
      'Content-Type':
        'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.appConfig.apiUrl + '/api/Events/', data, options);
  }


  participate(data: any): Observable<Response> {
    let headers = new Headers({
      'Content-Type':
        'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.appConfig.apiUrl + '/api/Events/Participate', data, options);
  }

  unparticipate(data: any): Observable<Response> {
    let headers = new Headers({
      'Content-Type':
        'application/json'
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.appConfig.apiUrl + '/api/Events/Unparticipate', data, options);
  }

  private handleError(error: Response) {
    return Observable.throw(error.json() || 'Opps!! Server error');
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

}
