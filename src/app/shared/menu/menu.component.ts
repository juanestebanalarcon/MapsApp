import { Component } from '@angular/core';

//Interfaz para cargar el menú automáticamente:
interface Menuitem{
  ruta:string;
  nombre:string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
    li {cursor:pointer;}
    `
  ]
})
export class MenuComponent {

  //Arreglo que contendrá las rutas del menú:
  menuItem:Menuitem[]=[
    {
      ruta:'/mapas/fullScreen',
      nombre:'FullScreen'
    },
    {
      ruta:'/mapas/zoom-range',
      nombre:'Zoom Range'
    },
    {
      ruta:'/mapas/marcadores',
      nombre:'Marcadores'
    },
    {
      ruta:'/mapas/propiedades',
      nombre:'Propiedades'
    },
  ]

}
