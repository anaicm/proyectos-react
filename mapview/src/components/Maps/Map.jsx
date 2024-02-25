//pinta una capa superior para mostrar los poligonos, agregando una nueva capa a una ranura
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "../../Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const Map = () => {
  //declara un estado para el contenedor que guarda el mapa que se devuelve despues en el return.
  const mapContainerRef = useRef(null);//se tiene que poner 
  const [map, setMap] = useState(null);//constante para guardar el mapa
  //constante para cambiar el mapa de noche a dia
  const [nightMode, setNightModeMode] = useState(false);
  // Initialize map when component mounts
  useEffect(() => {
    //la primera vez que carga el componente map, no tiene dependencias []
    //constante que inicializa el map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11", //https://docs.mapbox.com/api/maps/styles/
      center: [0, 40], //latitud y longitud
      zoom: 7, //donde va a cargar el mapa inicial
    });
// source= fuente
/**el valor del source debe de ser el mismo que en addSource */
    map.on("style.load", () => {
      //el source es la fuente de datos para pintar la capa
      map.addSource("urban-areas", {
        type: "geojson",//formato de lo que viene por la api
        data: "https://docs.mapbox.com/mapbox-gl-js/assets/ne_50m_urban_areas.geojson",//URL donde estan todos los datos
      });

      map.addLayer({//Layer=Capa, 
        id: "urban-areas-fill",//el id un nombre de la capa, el que se quiera. fill =relleno
        type: "fill",//rellena lo que hay dentro de los poligonos y se rellena con el color que hay en 
        //paint.
        slot: "middle",//slot => actua como un marcador de posición pueden ser (bottom, middle, top)
        source: "urban-areas",//valor de addSource
        layout: {},
        paint: {//relleno para los poligonos
          "fill-color": "#f08",
          "fill-opacity": 0.4,
        },
      });

      setMap(map); //guarda el mapa
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  //salta cuando cambia el nightMode, dependiendo del estado pone un estilo y otro con la ternaria
  //en el mismo mapa que esta cargado anteriormente y no hay que volver a cargarlo.
  useEffect(() => {
    if(map){//mira si el mapa esta inicializado
      map.setStyle(
        //una ternaira si estoy en modo noche me pone el primer estilo si es false el segundo
        nightMode
          ? "mapbox://styles/mapbox/navigation-night-v1"
          : "mapbox://styles/mapbox/streets-v11"
      );  
    }  
  }, [map, nightMode]);//dependencias: nightMode para que salte cuando lo tenga que hacer y map es la 
  //dependencia que necista para poder realizar el mapa.

  return (
    <div>
      
        {/**Toogle, cambia de true a false el valor booleano inicializa en false !nightMode=true */}
      <button
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          backgroundColor: "red",
          zIndex: 2,
        }}
        onClick={() => setNightModeMode(!nightMode)}
      >
        Dark Mode
      </button>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default Map;
