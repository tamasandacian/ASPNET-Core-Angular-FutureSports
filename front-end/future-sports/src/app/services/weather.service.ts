import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../app-config';

@Injectable()
export class WeatherService {

  constructor(
    private http: Http,
    private appConfig: AppConfig
  ) { }

  storeWeather(weatherObj: any) {
    let headers = new Headers({
      'Content-Type':
        'application/json; charset=utf-8'
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.appConfig.apiUrl + '/api/Weather', JSON.stringify(weatherObj), options);
  }

  private handleError(error: Response) {
    return Observable.throw(error.json() || 'Opps!! Server error');
  }
}