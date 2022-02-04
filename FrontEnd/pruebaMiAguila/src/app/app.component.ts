import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout'
import { MapCustomService } from './map-custom.service';
import { Socket } from 'ngx-socket-io';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  @ViewChild(MatSidenav) 
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver){

  }
  ngAfterViewInit(){
    this.observer.observe(['(max-width: 800px)']).subscribe((res)=>{
      if(res.matches){
        this.sidenav.mode = 'over';
        this.sidenav.close();
      }else{
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  title = 'pruebaMiAguila';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class ComponenteApp implements OnInit {
  @ViewChild('asGeoCoder')
  asGeoCoder!: ElementRef;
  modeInput = 'start';
  wayPoints: WayPoints = {start: null, end: null};

  constructor(private mapCustomService: MapCustomService, private renderer2: Renderer2,
              private socket: Socket) {
  }

  ngOnInit(): void {
    this.mapCustomService.buildMap()
      .then(({geocoder, map}) => {
        // this.asGeoCoder
        this.renderer2.appendChild(this.asGeoCoder.nativeElement,
          geocoder.onAdd(map)
        );


        console.log('*** Perfecto *****');
      })
      .catch((err) => {
        console.log('******* ERROR ******', err);
      });

    this.mapCustomService.cbAddress.subscribe((getPoint) => {
      if (this.modeInput === 'start') {
        this.wayPoints.start = getPoint;
      }
      if (this.modeInput === 'end') {
        this.wayPoints.end = getPoint;
      }
    });

    this.socket.fromEvent('position')
      .subscribe(({coords}) => {
        console.log('******* DESDE SERVIDOR ****', coords);
        this.mapCustomService.addMarkerCustom(coords);
      })
  }

  drawRoute(): void {
    console.log('***** PUNTOS de ORIGEN y DESTINO', this.wayPoints)
    const coords = [
      this.wayPoints.start.center,
      this.wayPoints.end.center
    ];

    this.mapCustomService.loadCoords(coords);
  }

  changeMode(mode: string): void {
    this.modeInput = mode;
  }

  testMarker(): void {
    this.mapCustomService.addMarkerCustom([-8.628139488926513, 41.159082702543635]);
  }
}

export class WayPoints {
  start: any;
  end: any
}

