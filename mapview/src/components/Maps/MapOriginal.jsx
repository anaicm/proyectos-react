//mostrar el mapa en la web normal en la web

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "../../Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapOriginal = () => {
  //declara un estado para el contenedor que guarda el mapa que se devuelve despues en el return.
  const mapContainerRef = useRef(null);//se tiene que poner 
  const [map, setMap] = useState(null);//constante para guardar el mapa
 
  // Initialize map when component mounts
  useEffect(() => {
    //la primera vez que carga el componente map, no tiene dependencias []
    //constante que inicializa el map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11", //https://docs.mapbox.com/api/maps/styles/
      center: [0, 40], //latitud y longitud
      zoom: 1, //donde va a cargar el mapa inicial
    });

    setMap(map);
    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapOriginal;
