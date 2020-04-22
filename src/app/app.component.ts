import { Component } from '@angular/core';
import {CountryService} from './lab2/country.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'imitational-models';
  constructor(private _: CountryService) {
  }
}
