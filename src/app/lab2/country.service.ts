import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import * as echarts from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private data = new BehaviorSubject({});
  public readonly $data = this.data.asObservable();
  private countries = new BehaviorSubject([]);
  public readonly $countries = this.countries.asObservable();

  constructor(private http: HttpClient) {
    this.loadData();
  }


  loadData(): void{
    this.http.get('assets/countries.geojson').subscribe((data: any) => {
      this.data.next(data);
      console.log(data);
      const names = data.features.map(feature => feature.properties.ADMIN);
      data.features.forEach(feature => {
        echarts.registerMap(feature.properties.ADMIN, {type: 'FeatureCollection', features: [feature]});
      });
      echarts.registerMap('World', data);
      this.countries.next(names);
    });
  }


  getCountry(name: string){
    return echarts.getMap(name)?.geoJson;
  }
}
