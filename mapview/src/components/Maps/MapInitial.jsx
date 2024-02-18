//pinta una capa superior para mostrar los poligonos, agregando una nueva capa a una ranura
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "../../Map.css";
import styles from "../../css/button.module.css";
import {
  UrbanAreasLayer,
  CapaIconos,
  CapaTerremotos,
  CapaTerremotosNoAgrupados,
  CapaTerremotosRecuento,
  addRouteLayer,
} from "../funciones";
import {
  handleClusterClick,
  handleUnclusteredPointClick,
  handleClusterMouseEnter,
  handleClusterMouseLeave,
} from "../funciones/eventosTerremotos";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapInitial = () => {
  //declara un estado para el contenedor que guarda el mapa que se devuelve despues en el return.
  const mapContainerRef = useRef(null); //se tiene que poner
  const [map, setMap] = useState(null); //constante para guardar el mapa
  //constante para cambiar el mapa de noche a dia
  const [nightMode, setNightModeMode] = useState(false);
  // Initialize map when component mounts
  useEffect(() => {
    //la primera vez que carga el componente map, no tiene dependencias []
    //constante que inicializa el map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 40], //latitud y longitud
      zoom: 7, //donde va a cargar el mapa inicial
    });
    // source= fuente
    /**el valor del source debe de ser el mismo que en addSource */
    map.on("style.load", () => {
      //el source es la fuente de datos para pintar la capa
      map.addSource("urban-areas", {
        type: "geojson", //formato de lo que viene por la api
        data: "https://docs.mapbox.com/mapbox-gl-js/assets/ne_50m_urban_areas.geojson", //URL donde estan todos los datos
      });
      //fuente para la capa de terremotos
      map.addSource("earthquakes", {
        type: "geojson",
        data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
        cluster: true, //clusterizar es agrupar cosas en una circunferencia
        clusterMaxZoom: 14, //minimo de cuando te acercas, si te acercas 14 no se ve ningun cluster
        clusterRadius: 250, //radio de la circunferencia que abarca
      });
      //fuente para la capa que pinta una ruta en línea en el mapa 
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

      // capa areas urbanas
      map.addLayer(UrbanAreasLayer());
      //capaIconos
      CapaIconos(map);
      //capas terremotos
      map.addLayer(CapaTerremotos());
      map.addLayer(CapaTerremotosNoAgrupados());
      map.addLayer(CapaTerremotosRecuento());
      //capa para la línea de la ruta en el mapa 
      addRouteLayer(map);
      setMap(map);
    });

    // Clean up on unmount
    return () => map.remove();
  }, []);
  //------------------------eventos para las capas terremotos---------------------------------------
  useEffect(() => {
    if (map) {
      handleClusterClick(map);
      handleUnclusteredPointClick(map);
      handleClusterMouseEnter(map);
      handleClusterMouseLeave(map);
    }
  }, [map]);
  //------------------------Cambia el mapa al modo noche--------------------------------------------
  //salta cuando cambia el nightMode, dependiendo del estado pone un estilo y otro con la ternaria
  //en el mismo mapa que esta cargado anteriormente y no hay que volver a cargarlo.
  useEffect(() => {
    if (map) {
      //mira si el mapa esta inicializado
      map.setStyle(
        //una ternaira si estoy en modo noche me pone el primer estilo si es false el segundo
        nightMode
          ? "mapbox://styles/mapbox/navigation-night-v1"
          : "mapbox://styles/mapbox/streets-v11"
      );
    }
  }, [map, nightMode]); //dependencias: nightMode para que salte cuando lo tenga que hacer y map es la
  //dependencia que necista para poder realizar el mapa.

  return (
    <div>
      {/**Toogle, cambia de true a false el valor booleano inicializa en false !nightMode=true */}
      <button
        className={styles.button}
        onClick={() => setNightModeMode(!nightMode)}
      >
        Dark Mode
      </button>

      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapInitial;
