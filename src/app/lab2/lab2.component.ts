import { Component, OnInit } from '@angular/core';
import EChartOption = echarts.EChartOption;
import {CountryService} from './country.service';
import {FormBuilder, FormControl} from '@angular/forms';
import * as turf from '@turf/turf';
import { AllGeoJSON, BBox, Feature, FeatureCollection, Polygon, MultiPolygon } from '@turf/turf';
import * as math from 'mathjs';

@Component({
  selector: 'app-lab2',
  templateUrl: './lab2.component.html',
  styleUrls: ['./lab2.component.css']
})
export class Lab2Component implements OnInit {
  options: EChartOption;
  countries = [];

  nameControl: FormControl;
  pointsControl: FormControl;

  expectedArea;
  actualArea;

  country: FeatureCollection;

  constructor(private service: CountryService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.nameControl = this.fb.control('Ukraine');
    this.pointsControl = this.fb.control(500);

    this.service.$countries.subscribe(countries => {
      this.countries = countries;
      this.setOptions();
      this.selected('Ukraine');
    });

  }

  setOptions() {
    this.options = {
      geo: {
        map: 'World',
        show: true,
        left: 0, top: 0, right: 0, bottom: 0,
        nameProperty: 'ADMIN',
        boundingCoords: [
          [-180, 90], [180, -90]
        ],
        z: 2
      },
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
          symbolSize: 5,
        },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
          symbolSize: 5,
        },
        {
          type: 'lines',
          coordinateSystem: 'geo',
          polyline: true,
          data: [],
        },
        // {
        //   type: 'scatter',
        //   coordinateSystem: 'geo',
        //   data: [[31.14619144700015, 48.37499908750003]],
        //   symbolSize: 10
        // },
      ]
    };
  }

  selected(name: string){
    this.clearData();
    this.country = this.service.getCountry(name) as FeatureCollection;
    if (!this.country){
      return;
    }
    const bbox = turf.bbox(this.country);
    this.setMap(name);
    this.setCenter(this.country);
    this.setZoom(bbox);

    this.options = {...this.options};
  }

  compute(){
    const country = this.country;

    if (!country) {
      return;
    }

    const count = this.pointsControl.value;
    const bbox = turf.bbox(country);
    const area = this.setBoundingRectangle(bbox);

    const ratio = this.throwPoints(country, bbox, count);
    this.actualArea = (area * ratio) / 1000000; // km2
    this.expectedArea = turf.area(country) / 1000000; // km2

    this.options = {...this.options};
  }

  setMap(name: string){
    this.options.geo['map'] = name;
  }

  setBoundingCoords(bbox: BBox){
    this.options.geo['boundingCoords'] = [
      [math.max(bbox[0] - 30, -180), math.min(bbox[1] + 30,  90)],
      [math.min(bbox[2] + 30 , 180), math.max(bbox[3] - 30, -90)]
    ];
  }

  setBoundingRectangle(bbox: BBox){
    const square: Feature<Polygon> = turf.bboxPolygon(bbox);
    const area = turf.area(square);
    const coords = square.geometry.coordinates[0];
    coords.push(coords[0]);
    this.options.series[2].data = [{coords}];
    return area;
  }

  throwPoints(country: FeatureCollection, bbox: BBox, count: number){
    const polygon = country.features[0].geometry;
    const collection: FeatureCollection = turf.randomPoint(count, {bbox});
    const points = collection.features.map((f: Feature) => f.geometry['coordinates']);
    const insidePoints = [];
    const outsidePoints = [];

    points.forEach(p => {
      const isInside = turf.booleanPointInPolygon(p, polygon as MultiPolygon);
      if (isInside){
        insidePoints.push(p);
      } else {
        outsidePoints.push(p);
      }
    });

    this.options.series[0].data = [...insidePoints];
    this.options.series[1].data = [...outsidePoints];
    // this.options = {...this.options};

    return insidePoints.length / count;
  }

  clearData(){
    this.actualArea = 0;
    this.expectedArea = 0;
    this.options.series[0].data = [];
    this.options.series[1].data = [];
    this.options.series[2].data = [];
  }

  setZoom(bbox: BBox){
    const square = turf.bboxPolygon(bbox);
    const squareArea = turf.area(square);
    const worldsquare = turf.area(turf.bboxPolygon([-180, 90, 180, -90]));
    const zoom = (worldsquare / squareArea);

    console.log(`wsquare ${worldsquare} square ${squareArea} zoom ${zoom}`);

    const enhancedZoom = math.nthRoot(zoom, 2.3);
    this.options.geo['zoom'] =  enhancedZoom < 4 ? 1 : enhancedZoom;
    // this.options.geo['zoom'] = 1;
  }

  setCenter(country: AllGeoJSON){
    const center = turf.center(country);
    this.options.geo['center'] = center.geometry.coordinates;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

}
