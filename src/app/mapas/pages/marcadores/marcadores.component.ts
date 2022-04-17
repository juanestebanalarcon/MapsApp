import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcardorColor{
  color:string;
  marker?:mapboxgl.Marker;
  center?:[number,number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container{
      width:100%;
      height:100%;
    }
    .list-group{
      position:fixed;
      top:20px;
      right:20px;
      z-index:99;
    }
    li {cursor:pointer;}
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa')divMapa!:ElementRef;
  mapa!:mapboxgl.Map;
  zoomLevel:number=17;
  center:[number,number]=[-76.30083164239018,3.546859304140611];
  //Array de marcadores:
  marcadores: MarcardorColor[]=[];
  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container:this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center, //longitud, latitud
      zoom:this.zoomLevel
    });
    /* 
    new mapboxgl.Marker().setLngLat(this.center).addTo(this.mapa);
    const markerHTML= HTMLElement = document.createElement('div');
    markerHtml.innerHTML='Puntero';
    new mapboxgl.Marker({element:markerHTML})
    */
   this.leerLocalStorage()
  }
  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador= new mapboxgl.Marker({
      draggable:true,
      color
    }).setLngLat(this.center).addTo(this.mapa);
    //Agregarlo al arreglo:
    this.marcadores.push({
      color,
      marker:nuevoMarcador
    });
    this.guardarMarcadoresLocalStorage()
    nuevoMarcador.on('dragend',()=>{this.guardarMarcadoresLocalStorage()})
  }
  irMarcador(marker:mapboxgl.Marker){
    this.mapa.flyTo({
      center:marker.getLngLat()
    })
  }
  guardarMarcadoresLocalStorage(){
    const lnglatArr:MarcardorColor[]=[];
    this.marcadores.forEach(m=>{
      const color=m.color;
      const {lng,lat}=m.marker!.getLngLat();
      lnglatArr.push({
        color:m.color,
        center:[lng,lat]
      });
      localStorage.setItem('Marcadores',JSON.stringify(lnglatArr));

    })
  }
  leerLocalStorage(){
    if(!localStorage.getItem('Marcadores')){
       return;
    }
    const lngLatArr:MarcardorColor[]=JSON.parse(localStorage.getItem('Marcadores')!);
    lngLatArr.forEach(m=>{
      const newMarker=new mapboxgl.Marker({
        color:m.color,
        draggable:true,
      }).setLngLat(m.center!).addTo(this.mapa);
      this.marcadores.push({marker:newMarker,color:m.color})
      newMarker.on('dragend',()=>{this.guardarMarcadoresLocalStorage()})
    })
  }
  borrarMarcador(i:number){
    //se borra del mapa
    this.marcadores[i].marker?.remove();
    //se borra del arreglo
    this.marcadores.splice( i,1);
    this.guardarMarcadoresLocalStorage();
  }
}
