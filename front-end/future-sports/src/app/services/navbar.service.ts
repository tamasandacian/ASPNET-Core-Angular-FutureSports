import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NavbarService {


  private navStateSource = new Subject<any>();
  navState$ = this.navStateSource.asObservable();

  constructor() { }

  setNavBarState( state: any ) {
    this.navStateSource.next( state );
  }
}
