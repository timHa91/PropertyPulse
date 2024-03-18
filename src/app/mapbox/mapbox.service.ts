import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Property } from '../shared/model/property.model';
import { Observable, Subject, map } from 'rxjs';
import { FeatureCollection } from '../shared/model/geo.model';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];
  updateMap = new Subject<void>();

  constructor(private http: HttpClient) { }

initializeMap() {
  this.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom: 13,
    accessToken: environment.mapbox.accessToken,
  });
  this.updateMap.next();
}

setMarker(coordinates: [number, number]) {
  const marker = new mapboxgl.Marker()
  .setLngLat(coordinates)
  .addTo(this.map);
  this.markers.push(marker);
}

removeAllMarkers() {
  if(this.markers.length > 0) {
      this.markers.forEach(marker => {
          marker.remove();
      });
  }
}

placeAllMarkers(properties: Property[]) {
  properties.forEach( item => {
      this.setMarker(item.geometry.geometry.coordinates)
  });
}

calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Radius of the earth in m
  const φ1 = this.deg2rad(lat1);
  const φ2 = this.deg2rad(lat2);
  const Δφ = this.deg2rad(lat2 - lat1);
  const Δλ = this.deg2rad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in m
}

private forwardGeocoder(searchText: string): Observable<[number, number]> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${environment.mapbox.accessToken}&limit=1`;
  return this.http.get<FeatureCollection>(url)
   .pipe(
    map( response => {
     return response.features[0].geometry.coordinates;
      })
  );
}
  
private getCenter(properties: Property[]): [number, number] {
  let longSum = 0;
  let latSum = 0;
  let count = 0;
 
  properties.forEach(item => {
     longSum += item.geometry.geometry.coordinates[0];
     latSum += item.geometry.geometry.coordinates[1];
     count++;
  });
 
  if (count > 0) {
     return [longSum / count, latSum / count];
    } else {
     return [0, 0]; 
    }
 }

updateMapCenter(properties: Property[]) {
  if (this.map) {
    const newCenter = this.getCenter(properties);
    this.map.setCenter(newCenter);
  }
}
   
private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

getLocationCoordinates(location: string): Observable<[number, number]> {
  return this.forwardGeocoder(location.toLocaleLowerCase());
}
}
