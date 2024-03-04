import { Component, OnInit } from '@angular/core';
import { MapboxService } from './map.service';

@Component({
  selector: 'app-map',
  template: '<div #mapContainer id="map" class="map"></div>',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor (private mapService: MapboxService) {}

   ngOnInit(): void {
     this.mapService.initializeMap();
   }
}
