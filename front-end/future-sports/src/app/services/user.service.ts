import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AppConfig } from '../app-config';
import { User } from '../model/user';



@Injectable()
export class UserService {

  constructor(private http: Http, private appConfig: AppConfig) { }

  getAll(){
    return this.http.get(this.appConfig.apiUrl + '/api/User', this.jwt()).map((response: Response) => response.json());
  }

  getById(_id: string){
    return this.http.get(this.appConfig.apiUrl + '/api/User/' + _id, this.jwt()).map((response: Response) => response.json());
  }

  getByUsername(username: string){
    return this.http.get(this.appConfig.apiUrl + '/api/User/GetUserByUsername/' + username).map((response: Response) => response.json());
  }

  getAllEventsForUsers(username: string){
    return this.http.get(this.appConfig.apiUrl + '/api/User/GetAllEventsForEachUser/' + username, this.jwt()).map((response: Response) => response.json());
  }


  create(user: User){
    return this.http.post(this.appConfig.apiUrl + '/api/User/Register', user, this.jwt());
  }

  update(user: User){
    return this.http.put(this.appConfig.apiUrl + '/api/User/' + user.id, user, this.jwt());
  }

  delete(_id: string){
    return this.http.delete(this.appConfig.apiUrl + '/api/User/' + _id, this.jwt());
  }

  // private helper methods
   private jwt() {
            // create authorization header with jwt token
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.token) {
                let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
                return new RequestOptions({ headers: headers });
            }
        }
}
