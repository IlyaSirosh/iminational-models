import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { Lab1Component } from './lab1/lab1.component';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgxEchartsModule} from 'ngx-echarts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import { ReactOnDelayDirective } from './react-on-delay.directive';
import { Lab2Component } from './lab2/lab2.component';
import {CountryService} from './lab2/country.service';
import {HttpClientModule} from '@angular/common/http';
import {MAT_SELECT_SCROLL_STRATEGY, MAT_SELECT_SCROLL_STRATEGY_PROVIDER, MatSelectModule} from '@angular/material/select';
import { Lab3Component } from './lab3/lab3.component';

const appRoutes: Routes = [
  {path: 'integral-monte-carlo', component: Lab1Component},
  {path: 'country-monte-carlo', component: Lab2Component},
  {path: 'option-price-monte-carlo', component: Lab3Component},
  {path: 'home', component: HomeComponent},
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,
    Lab1Component,
    HomeComponent,
    ReactOnDelayDirective,
    Lab2Component,
    Lab3Component
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    RouterModule.forRoot(appRoutes),
    MatFormFieldModule,
    NgxEchartsModule,
    MatIconModule,
    MatSliderModule,
    MatSelectModule,
  ],
  providers: [CountryService, MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule { }
