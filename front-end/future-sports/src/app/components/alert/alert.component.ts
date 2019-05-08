import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor(
    private alertService: AlertService,
    
  ) { }

  message: any;

  ngOnInit() {
    this.alertService.getMessage().subscribe(message => { this.message = message });
  }

}
