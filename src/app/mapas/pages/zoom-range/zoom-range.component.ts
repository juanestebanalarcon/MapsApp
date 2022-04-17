import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container{
      width:100%;
      height:100%;
    }
    .row{
      background-color:white;
      border-radius:10px;
      bottom:50px;
      left:50px;
      padding:10px;
      z-index:999;
      position:fixed;
      width:400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('mapa')divMapa!:ElementRef;
  mapa!:mapboxgl.Map;
  zoomLevel:number=10;
  center:[number,number]=[-76.30083164239018,3.546859304140611];

  constructor() { }
  ngOnDestroy(): void {
    //Destruir los listeners después de recargar la página.
    this.mapa.off('zoom',()=>{});
    this.mapa.off('zoomend',()=>{});
    this.mapa.off('move',()=>{});
  }
  //Me permite cargar el elemento después que la vista se cargue, sin generar conflicto con las múltiples referencias que pueda
  //Hacer al #mapa
  ngAfterViewInit(): void{
    this.mapa = new mapboxgl.Map({
      container:this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center, //longitud, latitud
      zoom:this.zoomLevel
    });
    //Listener para capturar el evento zoom que hace el usuario y mantener actualizado el indicador de zoom cuando se dispara
    //el evento:
    this.mapa.on('zoom',()=>{
      this.zoomLevel=this.mapa.getZoom();  
    })
    //Listener para controlar el zoom máximo que puede hacer el usuario:
    this.mapa.on('zoomend',()=>{
      if(this.mapa.getZoom()>19){
        this.mapa.zoomTo(19); 
      }
    })
    //Movimiento del mapa:
    this.mapa.on('move',(event) =>{
      const target=event.target;
      const {lng,lat}=target.getCenter();
      this.center=[lng,lat];
    });
  }
  zoomCambio(valor:string){
    this.mapa.zoomTo(Number(valor));
  }
  zoomOut(){
    this.mapa.zoomOut();
   // this.zoomLevel=this.mapa.getZoom();
  }
zoomIn(){
  this.mapa.zoomIn();
  //this.zoomLevel=this.mapa.getZoom();
}
}
