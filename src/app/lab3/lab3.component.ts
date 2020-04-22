import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-lab3',
  templateUrl: './lab3.component.html',
  styleUrls: ['./lab3.component.css']
})
export class Lab3Component implements OnInit {
  formGroup: FormGroup;
  expectedPrice: number;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      price: new FormControl(245, Validators.required),
      profit: new FormControl(15, Validators.required),
      volatility: new FormControl(5, Validators.required),
      time: new FormControl(5, Validators.required),
      count: new FormControl(100, Validators.required),
    });
  }

  compute(data){
    console.log(data);

    const {price, time, count} = data;
    let {profit, volatility} = data;
    profit = profit / 100;
    volatility = volatility / 100;

    console.log(`${price}, ${profit}, ${volatility}, ${time}, ${count}`);

    const x0 = (profit - (Math.pow(volatility, 2) / 2)) * time;
    const x1 = volatility * Math.sqrt(time);

    let sum = 0;
    Array.from(Array(count).keys()).forEach(_ => {
      const exp = x0 + x1 * Math.random();
      sum += price * Math.pow(Math.E, exp);
    });

    this.expectedPrice = sum / count;
  }

  formatLabel(value: number) {
    if (value >= 10000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
}
