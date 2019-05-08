import { Injectable, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

@Injectable()
export class GoogleMapService {

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { }

}
