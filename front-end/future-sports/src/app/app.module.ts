// Angular Components
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Component Tools
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { ToastrModule } from 'ngx-toastr';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';


import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { ModalModule } from 'ngx-bootstrap';




// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { HomeComponent } from './home/home.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { EventDetailsComponent } from './components/events/event-details/event-details.component';

import { AlertComponent } from './components/alert/alert.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

// Services
import { EventService } from './services/event.service';
import { WeatherService } from './services/weather.service';
import { AlertService } from './services/alert.service';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AppConfig } from './app-config';
import { MapConfig } from './map-config';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CheckCategoryPipe } from './categorySearch';
import { SearchFilter } from './searchFilter';
import { CreateEventComponent } from './components/events/create-event/create-event.component';
import { SharedModule } from './shared/shared.module';
import { SearchNavigationComponent } from './components/search-navigation/search-navigation.component';
import { AddressComponent } from './components/address/address.component';
import { GoogleMapService } from './services/google-map.service';
import { UsersComponent } from './components/admin/users/users.component';

import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { AdminEventsComponent } from './components/admin/admin-events/admin-events.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AuthAdminGuardService } from './services/auth-admin-guard.service';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';



const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: LoginComponent }, //canActivate: [AuthGuardService] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'event/:id', component: EventDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sidebar', component: SidebarComponent, canActivate: [AuthGuardService] },
  { path: 'myprofile', component: MyProfileComponent, canActivate: [AuthGuardService] },
  { path: 'profile/user/:username', component: ProfileUserComponent, canActivate: [AuthGuardService] },
  
  // Admin Pages
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthAdminGuardService] },
  { path: 'admin/events', component: AdminEventsComponent, canActivate: [AuthAdminGuardService] },
  { path: 'unauthorized', component: UnauthorizedComponent },
  // otherwise redirect to home
  // { path: '**', redirectTo: 'home', canActivate: [AuthGuardService] }

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    GoogleMapComponent,
    EventDetailsComponent,
    AlertComponent,
    MyProfileComponent,
    SidebarComponent,
    CheckCategoryPipe,
    SearchFilter,
    CreateEventComponent,
    AddressComponent,
    UsersComponent,
    AdminPanelComponent,
    AdminEventsComponent,
    AdminUsersComponent,
    UnauthorizedComponent,
    ProfileUserComponent,
    //SearchNavigationComponent

  ],

  imports: [

    SharedModule,

    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NKDatetimeModule,

    AgmCoreModule.forRoot({
      apiKey: 'REPLACE_THIS_WITH_YOUR_GOOGLE_MAP_CREDENTIALS',
      libraries: ["places"]
    }),

    AgmSnazzyInfoWindowModule,

    RouterModule.forRoot(routes),

    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'success' // set defaults here
    }),

    ModalModule.forRoot(),

    ToastrModule.forRoot({
      timeOut: 3500,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    AppConfig,
    MapConfig,
    EventService,
    WeatherService,
    UserService,
    AlertService,
    AuthenticationService,
    AuthGuardService,
    AuthAdminGuardService,
    GoogleMapService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }

