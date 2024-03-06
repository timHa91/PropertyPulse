import { Component, OnInit } from '@angular/core';
import { MapboxService } from './mapbox.service';

@Component({
  selector: 'app-mapbox',
  template: '<div #mapContainer id="map" class="map"></div>',
  styleUrls: ['./mapbox.component.css']
})
export class MapComponent implements OnInit {

  constructor (private mapService: MapboxService) {}

   ngOnInit(): void {
     this.mapService.initializeMap();
   }
}
