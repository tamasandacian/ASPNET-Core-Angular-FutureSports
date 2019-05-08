import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search-navigation',
  templateUrl: './search-navigation.component.html',
  styleUrls: ['./search-navigation.component.css']
})
export class SearchNavigationComponent implements OnInit {

  public searchForm: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.search();
  }

  search(){
    this.searchForm = this.fb.group({

    })
  }

  onSubmit(){
    // do something with the values
    console.log(this.searchForm.value)
  }

}
