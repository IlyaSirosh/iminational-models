import { Component, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import {FormBuilder, FormControl} from '@angular/forms';
import * as math from 'mathjs';
import {MonteCarlo} from './MonteCarlo';

@Component({
  selector: 'app-lab1',
  templateUrl: './lab1.component.html',
  styleUrls: ['./lab1.component.css']
})
export class Lab1Component implements OnInit {
  defaultFunction = '-x+10';
  defaultMinX = 5;
  defaultMaxX = 10;
  defaultCount = 500;
  functionControl: FormControl;
  minBoundaryControl: FormControl;
  maxBoundaryControl: FormControl;
  countControl: FormControl;
  options: EChartOption;
  visibleX = 15;
  visibleY = 15;
  maxY: number;

  result: MonteCarlo;


  data: number[][];
  upPoints: number[][];
  downPoints: number[][];
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.data = [];
    this.upPoints = [];
    this.downPoints = [];

    this.functionControl = this.fb.control(this.defaultFunction);
    this.minBoundaryControl = this.fb.control(this.defaultMinX);
    this.maxBoundaryControl = this.fb.control(this.defaultMaxX);
    this.countControl = this.fb.control(this.defaultCount);

    this.options = {
      title: {
      },
      grid: {
        show: true,
        backgroundColor: '#fdfdfd'
      },
      yAxis: {
        show: true,
        name: 'y',
        silent: true,
        min: 0,
        max: this.visibleY,
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [7, 17]
        }
      },
      xAxis: {
        type: 'value',
        show: true,
        name: 'x',
        silent: true,
        offset: 10,
        min: 0,
        max: this.visibleX,
        axisLine: {
          symbol: ['none', 'arrow'],
          symbolSize: [7, 17]
        },
      },
      series: [
        {
          type: 'line',
          coordinateSystem: 'cartesian2d',
          // xAxisIndex: 0,
          // yAxisIndex: 1,
          data: this.data,
          symbol: 'none'
        },
        {
          type: 'scatter',
          coordinateSystem: 'cartesian2d',
          data: this.upPoints,
          symbolSize: 5
        },
        {
          type: 'scatter',
          coordinateSystem: 'cartesian2d',
          data: this.downPoints,
          symbolSize: 5
        },
        {
          type: 'line',
          coordinateSystem: 'cartesian2d',
          symbol: 'none',
          data: [],
          lineStyle: {
            type: 'dashed'
          }
        },
        {
          type: 'line',
          coordinateSystem: 'cartesian2d',
          symbol: 'none',
          data: [],
          lineStyle: {
            type: 'dashed'
          }
        },
        {
          type: 'line',
          coordinateSystem: 'cartesian2d',
          symbol: 'none',
          data: [],
          lineStyle: {
            type: 'dashed'
          }
        }
      ]
    };

    this.paintChart();
  }

  isUnderFunction(X, y): boolean {
    const funcY = math.evaluate(this.expression, {x: X});
    return funcY >= y;
  }

  compute(){
    this.clearCountData();
    const y = this.findAppropriateYMax();
    this.result = MonteCarlo.compute(this.minX, this.maxX, y, this.count, this.isUnderFunction.bind(this));
    this.result.points.forEach(p => {
      if (p.isInside){
        this.downPoints.push([p.x, p.y]);
      } else {
        this.upPoints.push([p.x, p.y]);
      }
    });

    this.paintChart();
    this.options.series[5].data = [[this.minX, y], [this.maxX, y]];
  }

  findAppropriateYMax(): number {
    const min = this.minX;
    const max = this.maxX;
    let maxY = 0;
    const expression = this.expression;
    for (let X = min; X < max; X = X + 0.01){
      const y = math.evaluate(expression, {x: X});
      if (maxY < y){
        maxY = y;
      }
    }
    return 3 + maxY;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }


  setMinBoundary(){
    const min = this.minX;
    if ( min ){
      this.options.series[3].data = [[min, 0], [min,  this.visibleY]];
    }
  }

  setMaxBoundary(){
    const max = this.maxX;
    if (max) {
      this.options.series[4].data = [[max, 0], [max, this.visibleY]];
      this.visibleX = math.max(15, max + 5);
      this.options.xAxis['max'] = this.visibleX;
    }
  }

  setMaxVisibleY(){
    this.visibleY = math.max(15, math.floor(this.maxY) + 5);
    this.options.yAxis['max'] = this.visibleY;
    this.options.series[4].data[1][1] = this.visibleY;
    this.options.series[3].data[1][1] = this.visibleY;
  }

  repaintChart(){
    this.clearCountData();
    this.paintChart();
  }


  paintChart(){
    this.setMinBoundary();
    this.setMaxBoundary();
    this.drawChartFunction();
    this.setMaxVisibleY();

    this.options = {...this.options};
  }

  drawChartFunction(){
    const expression = this.expression;
    this.data = [];
    this.maxY = 0;
    for (let X = 0; X < this.visibleX; X = X + 0.01){
      const y = math.evaluate(expression, {x: X});
      this.data.push([X, y]);

      if (this.maxY < y){
        this.maxY = y;
      }
    }
    this.options.series[0].data = this.data;
  }


  get minX(): number {
    return math.evaluate(this.minBoundaryControl.value);
  }

  get maxX(): number {
    return math.evaluate(this.maxBoundaryControl.value);
  }

  get expression(){
    return this.functionControl.value;
  }

  get count(){
    return this.countControl.value;
  }

  clearCountData(){
    this.result = null;
    this.upPoints = [];
    this.downPoints = [];
    this.options.series[1].data =  this.upPoints;
    this.options.series[2].data =  this.downPoints;
    this.options.series[5].data = [];
    this.options = {...this.options};
  }
}
