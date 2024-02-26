//mostrar el mapa en la web normal en la web

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
//import geojson from "../data/DataIcons";


import "../../Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapProvincias = () => {
  //declara un estado para el contenedor que guarda el mapa que se devuelve despues en el return.
  const mapContainerRef = useRef(null); //se tiene que poner
  const [map, setMap] = useState(null); //constante para guardar el mapa

  // Initialize map when component mounts
  useEffect(() => {
    //la primera vez que carga el componente map, no tiene dependencias []
    //constante que inicializa el map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11", //https://docs.mapbox.com/api/maps/styles/
      center: [0, 40], //latitud y longitud
      zoom: 6, //donde va a cargar el mapa inicial
    });
    map.on("style.load", () => {
      map.addSource("urban-provincias", {
        type: "geojson", //formato de lo que viene por la api
        data: "http://localhost:3000/coords.json", //URL donde estan todos los datos
      });
      map.addLayer({
        //Layer=Capa,
        id: "urban-provincias-vector", //el id un nombre de la capa, el que se quiera. fill =relleno
        type: "fill", //rellena lo que hay dentro de los poligonos y se rellena con el color que hay en
        //paint.
        slot: "middle", //slot => actua como un marcador de posición pueden ser (bottom, middle, top)
        source: "urban-provincias", //valor de addSource
        layout: {},
        paint: {
          "fill-color": "#008DC0",
          "fill-opacity": 0.4,
          "fill-outline-color": "#002D82",
        },
      });
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("mouseenter", "urban-provincias-vector", (e) => {
        //coge la propiedad del json en este caso "provincia"
        const provinceName = e.features[0].properties.provincia;
        //la añade al mapa la propiedad.
        popup.setLngLat(e.lngLat).setHTML(provinceName).addTo(map);
      });
      //elimina el pop up cuando el raton sale del área
      map.on("mouseleave", "urban-provincias-vector", () => {
        popup.remove();
      });
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

export default MapProvincias;
