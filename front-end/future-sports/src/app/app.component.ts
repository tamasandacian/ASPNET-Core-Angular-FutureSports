import { Component } from '@angular/core';
import { User } from './model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  get adminPanel() {
  
    if (sessionStorage.getItem('isAdmin') == "true") {
      return false;
    }
    
    return true;


  }
}
