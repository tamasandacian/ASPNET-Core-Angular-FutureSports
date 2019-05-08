import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  loading = false;
 
  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {
   
   }

   userForm = new FormGroup({
   
 });

  register() {
  
    this.loading = true;
    this.userService.create(this.model)
      .subscribe(
        data => {
          this.alertService.success('Registration successfully done!', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error._body);
          this.loading = false;
        });
  }

  ngOnInit() {
    if(localStorage.getItem("currentUser")) this.router.navigateByUrl('');
  }

}
