import { NgModule } from "@angular/core";
import { GoogleMapComponent } from "../components/google-map/google-map.component";
import { AgmCoreModule } from "@agm/core";
import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { EventService } from "../services/event.service";
import { MapConfig } from "../map-config";
import { AppConfig } from "../app-config";
import { WeatherService } from "../services/weather.service";
import { SearchFilter } from "../searchFilter";

import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { SearchNavigationComponent } from "../components/search-navigation/search-navigation.component";
import { AddressComponent } from "../components/address/address.component";

@NgModule({
    imports: [

        CommonModule, 
        FormsModule,
        ReactiveFormsModule,
        HttpModule
    ],
    declarations: [
        SearchNavigationComponent
    ],
    exports: [
        SearchNavigationComponent,
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule
    ],
    providers: [
      ]
})

export class SharedModule { }