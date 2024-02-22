//mostrar el mapa en la web normal en la web
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import {
  UrbanAreasLayer,
  CapaIconos,
  CapaTerremotos,
  CapaTerremotosNoAgrupados,
  CapaTerremotosRecuento,
  addRouteLayer,
} from "../funciones";
import "../../Map.css";
import stylesSelectMap from "../../css/selectMap.module.css";
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapPrincipal = () => {
  //declara un estado para el contenedor que guarda el mapa que se devuelve despues en el return.
  const mapContainerRef = useRef(null); //se tiene que poner
  const [map, setMap] = useState(null); //constante para guardar el mapa
  //estado para las coordenadas de donde inicializar
  const [centro, setCentro] = useState([0, 40]);
  const [mapZoom, setMapZoom] = useState(7);
  const [clusterOpen, setClusterOpen] = useState(false);
  const [urbansOpen, setUrbansOpen] = useState(false);
  const [urbansBosque, setUrbansBosque] = useState(false);

  // Initialize map when component mounts
  useEffect(() => {
    //la primera vez que carga el componente map, no tiene dependencias []
    //constante que inicializa el map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: centro,
      zoom: mapZoom,
    });

   // map.on("style.load", () => {
     // map.addSource("bosques", {
       // type: "geojson", //formato de lo que viene por la api
        //data: "https://api.maptiler.com/data/ac533982-3640-4802-82df-3d2d741ec940/features.json?key=RZxGqTFix5IeutYU7exD", //URL donde estan todos los datos
      //});

      //map.addLayer({
        //id: "bosques-fill",
        //type: "fill",
        //slot: "middle",
        //source: "bosques",
        //layout: {},
        //paint: {
          //"fill-color": "green",
          //"fill-opacity": 0.4,
        //},
      //});
    //});
    // Agregar evento de mouseenter al polígono
    //map.on("mouseenter", "bosques-fill", (e) => {
      //if (map.getCanvas()) {
        //alert('raton dentro');
        //map.getCanvas().style.cursor = "pointer"; // Cambiar cursor a pointer
        //mapContainerRef.current.style.cursor = "pointer"; // Cambiar cursor del contenedor del mapa
        //map.setPaintProperty("bosques-fill", "fill-opacity", 1); // Cambiar la opacidad del polígono
     // }
    //});

    // Agregar evento de mouseleave al polígono para restaurar el estado original
    //map.on("mouseleave", "bosques-fill", (e) => {
      //if (map.getCanvas()) {
       // map.getCanvas().style.cursor = ""; // Restaurar cursor por defecto
        //mapContainerRef.current.style.cursor = ""; // Restaurar cursor del contenedor del mapa
        //map.setPaintProperty("bosques-fill", "fill-opacity", 0.4); // Restaurar opacidad original
      //}
    //});

    setMap(map);
    return () => map.remove();
  }, [centro, mapZoom]);

  //funcion para la capa zonas urbanas
  const handleLayerurbans = () => {
    setUrbansOpen(!urbansOpen); //
    //abre la capa del mapa
    if (map && !urbansOpen) {
      //si hay mapa y esta en verdadero
      if (!map.getSource("urban-areas")) {
        //si el mapa es distinto a la fuente del parametro
        map.addSource("urban-areas", {
          //añade la fuente
          type: "geojson",
          data: "https://docs.mapbox.com/mapbox-gl-js/assets/ne_50m_urban_areas.geojson",
        });
      }

      map.addLayer(UrbanAreasLayer()); //añade la capa importada del archivo funciones
      //cerrar la capa
    } else if (map && urbansOpen) {
      //si hay mapa y urbansOpen=false
      if (map.getSource("urban-areas")) {
        //si el mapa es esa fuente que entra por parametro
        map.removeLayer("urban-areas-fill"); //elimina la capa =>id=capa
        map.removeSource("urban-areas"); //elimina la fuente =>id=fuente
      }
    }
  };
  //funcion para la capa cluster terremotos
  const handleLayerCluster = () => {
    setClusterOpen(!clusterOpen); //
    //abre la capa del mapa
    if (map && !clusterOpen) {
      //si hay mapa y esta en verdadero
      if (!map.getSource("earthquakes")) {
        //si el mapa es distinto a la fuente del parametro
        map.addSource("earthquakes", {
          type: "geojson",
          data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
          cluster: true, //clusterizar es agrupar cosas en una circunferencia
          clusterMaxZoom: 14, //minimo de cuando te acercas, si te acercas 14 no se ve ningun cluster
          clusterRadius: 250, //radio de la circunferencia que abarca
        });
      }

      map.addLayer(CapaTerremotos()); //añade la capa importada del archivo funciones
      map.addLayer(CapaTerremotosNoAgrupados());
      map.addLayer(CapaTerremotosRecuento());
      //cerrar la capa
    } else if (map && clusterOpen) {
      //si hay mapa y urbansOpen=false
      if (map.getSource("earthquakes")) {
        //si el mapa es esa fuente que entra por parametro
        map.removeLayer("clusters"); //elimina la capa =>id=capa
        map.removeLayer("unclustered-point"); //elimina la capa =>id=capa
        map.removeLayer("cluster-count"); //elimina la capa =>id=capa
        map.removeSource("earthquakes"); //elimina la fuente =>id=fuente
      }
    }
  };
  //funcion para la capa bosque
  const handleLayerBosque = () => {
    setUrbansBosque(!urbansBosque); //
    //abre la capa del mapa
    if (map && !urbansBosque) {
      //si hay mapa y esta en verdadero
      if (!map.getSource("bosques")) {
        //si el mapa es distinto a la fuente del parametro
        map.addSource("bosques", {
          type: "geojson", //formato de lo que viene por la api
          data: "https://api.maptiler.com/data/ac533982-3640-4802-82df-3d2d741ec940/features.json?key=RZxGqTFix5IeutYU7exD", //URL donde estan todos los datos
        });
      }

      //añade la capa
      map.addLayer({
        id: "bosques-fill",
        type: "fill",
        slot: "middle",
        source: "bosques",
        layout: {},
        paint: {
          "fill-color": "green",
          "fill-opacity": 0.4,
        },
      });
      // Agregar evento de mouseenter al polígono
      map.on("mouseenter", "bosques-fill", (e) => {
        if (map.getCanvas()) {
          //alert('raton dentro');
          map.getCanvas().style.cursor = "pointer"; // Cambiar cursor a pointer
          map.setPaintProperty("bosques-fill", "fill-opacity", 1); // Cambiar la opacidad del polígono
        }
      });

      // Agregar evento de mouseleave al polígono para restaurar el estado original
      map.on("mouseleave", "bosques-fill", (e) => {
        if (map.getCanvas()) {
          map.getCanvas().style.cursor = ""; // Restaurar cursor por defecto
          map.setPaintProperty("bosques-fill", "fill-opacity", 0.4); // Restaurar opacidad original
        }
      });

      //cerrar la capa
    } else if (map && urbansBosque) {
      //si hay mapa y urbansOpen=false
      if (map.getSource("bosques")) {
        //si el mapa es esa fuente que entra por parametro
        map.removeLayer("bosques-fill"); //elimina la capa =>id=capa
        map.removeSource("bosques"); //elimina la fuente =>id=fuente
      }
    }
  };

  return (
    <div>
      <div className={stylesSelectMap.container}>
        <list>
          <ul className={stylesSelectMap.list}>Mapa original</ul>
          <ul className={stylesSelectMap.list} onClick={handleLayerCluster}>
            Cluster de terremotos
          </ul>
          <ul className={stylesSelectMap.list} onClick={handleLayerurbans}>
            Zonas urbanas
          </ul>
          <ul className={stylesSelectMap.list} onClick={handleLayerBosque}>
            Bosque
          </ul>
          <ul className={stylesSelectMap.list}>rutas</ul>
          <ul className={stylesSelectMap.list}>Imagen</ul>
        </list>
      </div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapPrincipal;
