//esta componente muestra una mapa con una línea que representa una ruta específica definida
//por una serie de coordenadas.
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";//importa la biblioteca de Mapbox GL JS 
import "../../Map.css";//archivo de estilos
//token de acceso de Mapbox GL JS
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapAddLinea = () => {
  const mapContainerRef = useRef(null);//referencia al contenedor del mapa en el DOM
  const [map, setMap] = useState(null);// almacenará la instancia del mapa.

  useEffect(() => {
    const map = new mapboxgl.Map({// nueva instancia del mapa
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-122.486052, 37.830348],
      zoom: 14,
    });

    map.on("load", () => {
      map.addSource("route", {//'route' añade una nueva fuente de datos para el GeoJson
        type: "geojson",
        data: {
          type: "Feature",//'feautre' objeto que contiene la fuente
          properties: {},
          geometry: {
            //geometría de tipo LineString, que representa la línea que se dibujará en el mapa.
            type: "LineString",
            coordinates: [
              [-122.483696, 37.833818],
              [-122.483482, 37.833174],
              [-122.483396, 37.8327],
              [-122.483568, 37.832056],
              [-122.48404, 37.831141],
              [-122.48404, 37.830497],
              [-122.483482, 37.82992],
              [-122.483568, 37.829548],
              [-122.48507, 37.829446],
              [-122.4861, 37.828802],
              [-122.486958, 37.82931],
              [-122.487001, 37.830802],
              [-122.487516, 37.831683],
              [-122.488031, 37.832158],
              [-122.488889, 37.832971],
              [-122.489876, 37.832632],
              [-122.490434, 37.832937],
              [-122.49125, 37.832429],
              [-122.491636, 37.832564],
              [-122.492237, 37.833378],
              [-122.493782, 37.833683],
            ],
          },
        },
      });

      map.addLayer({
        id: "route",//fuente que usa la capa 
        type: "line",//tipo de la capa 
        source: "route",//fuente
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 8,
        },
      });
    });

    setMap(map);

    return () => map.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapAddLinea;
