//capa Agregar íconos personalizados con marcadores
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import geojson from "../data/DataMapIconsPersonalizados";
import "../../Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapIconsPersonalizados = () => {
  //declara un estado para el contenedor que guarda el mapa que se devuelve despues en el return.
  const mapContainerRef = useRef(null); //se tiene que poner
  const [map, setMap] = useState(null); //constante para guardar el mapa

  useEffect(() => {
    //la primera vez que carga el componente map, no tiene dependencias []
    //constante que inicializa el map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12", //https://docs.mapbox.com/api/maps/styles/
      center: [-65.017, -16.457], //latitud y longitud
      zoom: 5, //donde va a cargar el mapa inicial
    });
    /**, este bloque de código también crea marcadores personalizados en el mapa, 
     * cada uno representado por un elemento div con una imagen de fondo específica y un evento 
     * de clic asociado.  */
    //Iteración sobre los elementos de geojson.features: El bucle for...of itera sobre cada elemento
    //en la matriz geojson.features. Cada elemento representa un marcador en el mapa.
    for (const marker of geojson.features) {
      //Creación de un elemento DOM para cada marcador: Se crea un nuevo elemento div (el)
      //utilizando document.createElement('div'). Este div se utilizará como el marcador en el mapa.
      const el = document.createElement("div");
      //Obtención de dimensiones del ícono del marcador: Se obtienen las dimensiones del ícono
      //del marcador de las propiedades iconSize del marcador actual. Estas dimensiones
      //se utilizan para definir el ancho y alto del elemento div.
      const width = marker.properties.iconSize[0];
      const height = marker.properties.iconSize[1];
      //Estilo del marcador: Se establece la clase CSS del elemento div como 'marker' y se define
      //el fondo del elemento div como la imagen de un gatito (usando placekitten.com) con las
      //dimensiones obtenidas anteriormente. Además, se establece el ancho y alto del elemento
      //div de acuerdo a las dimensiones del ícono del marcador. Finalmente, se establece que el
      //tamaño de la imagen de fondo se ajuste al 100% del tamaño del marcador.
      el.className = "marker";
      el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";
      //Evento de clic en el marcador: Se agrega un evento de clic al elemento div.
      // Cuando se hace clic en el marcador, se muestra una alerta con el mensaje asociado
      //al marcador (marker.properties.message).
      el.addEventListener("click", () => {
        window.alert(marker.properties.message);
      });
      //Añadir marcadores al mapa: Se crea un nuevo marcador (new mapboxgl.Marker(el)) utilizando 
      //el elemento div creado anteriormente como su representación visual. Se establece la longitud
      // y latitud del marcador usando las coordenadas del marcador (marker.geometry.coordinates). 
      //Finalmente, el marcador se agrega al mapa con el método addTo(map).
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
    }

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};
export default MapIconsPersonalizados;
