//capa Agregar íconos personalizados con marcadores
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import geojson from "../data/DataIcons";
import "../../Map.css";
import {getImage} from "../funciones";


mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const Icons = () => {
  //declara un estado para el contenedor que guarda el mapa que se devuelve despues en el return.
  const mapContainerRef = useRef(null); //se tiene que poner
  const [map, setMap] = useState(null); //constante para guardar el mapa

 
  useEffect(() => {
    //la primera vez que carga el componente map, no tiene dependencias []
    //constante que inicializa el map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11", //https://docs.mapbox.com/api/maps/styles/
      center: [-65.017, -16.457], //latitud y longitud
      zoom: 5, //donde va a cargar el mapa inicial
    });
  
    for (const marker of geojson.features) {
     
      const el = document.createElement("div");
     
      const width = marker.properties.iconSize[0];
      const height = marker.properties.iconSize[1];
      const background = marker.properties.imagen; 
      
      el.className = "marker";
      el.style.backgroundImage = `url(${getImage(background)})`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";
    
      el.addEventListener("click", () => {
        window.alert(marker.properties.message);
      });
     
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
export default Icons;
