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
import {
  SetupPopup,
  handleUnclusteredPointHover,
} from "../funciones/eventoHoverLeyenda";
import { handleClusterClick } from "../funciones/eventosTerremotos";
import "../../Map.css";
import styles from "../../css/button.module.css";
import stylesSelectMap from "../../css/selectMap.module.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapPrincipal = () => {
  //declara un estado para el contenedor que guarda el mapa que se devuelve despues en el return.
  const mapContainerRef = useRef(null); //se tiene que poner
  const [map, setMap] = useState(null); //constante para guardar el mapa
  //estado para las coordenadas de donde inicializar
  const [centro, setCentro] = useState([-87.622088, 41.878781]);
  const [mapZoom, setMapZoom] = useState(10);
  //constante para cambiar el mapa de noche a dia
  const [nightMode, setNightModeMode] = useState(false);
  const [clusterOpen, setClusterOpen] = useState(false);
  const [urbansOpen, setUrbansOpen] = useState(false);
  const [urbansBosque, setUrbansBosque] = useState(false);
  const [urbansRutas, setUrbansRutas] = useState(false);
  const [urbansImagen, setUrbansImagen] = useState(false);
  // Initialize map when component mounts
  useEffect(() => {
    //la primera vez que carga el componente map, no tiene dependencias []
    //constante que inicializa el map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: centro,
      zoom: mapZoom,
    });
    map.on("style.load", () => {
      map.addSource("countries", {
        type: "vector",
        tiles: [
          "https://api.maptiler.com/tiles/countries/{z}/{x}/{y}.pbf?key=RZxGqTFix5IeutYU7exD",
        ],
        minzoom: 6,
        maxzoom: 14,
      });
      //capa
      map.addLayer(
        {
          id: "countries-fill", // Layer ID
          type: "fill",
        
          source: "countries", // ID of the tile source created above
          // Source has several layers. We visualize the one with name 'sequence'.
          "source-layer": "countries",
          layout: {},
          paint: {
            "fill-opacity": 0.6,
            "fill-color": "rgb(53, 175, 109)",
           
          },
        },
       
      );

      map.addControl(new mapboxgl.NavigationControl());
    });
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
      //añade la capa importada del archivo funciones
      map.addLayer(CapaTerremotos());
      map.addLayer(CapaTerremotosNoAgrupados());
      map.addLayer(CapaTerremotosRecuento());
      //eventos
      if (map) {
        handleClusterClick(map);
        handleUnclusteredPointHover(map); //evento para el hover raton por encima
        SetupPopup(map); //evento para pop up del hover
      }
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
  //funcion para la capa Imagen
  const handleLayerImagen = () => {
    setUrbansImagen(!urbansImagen); //
    //abre la capa del mapa
    if (map && !urbansImagen) {
      //si hay mapa y esta en verdadero
      if (!map.getSource("Iconos")) {
        //si el mapa es distinto a la fuente del parametro
        map.addSource("Iconos", {
          type: "geojson", //formato de lo que viene por la api
          data: "https://api.maptiler.com/data/ac533982-3640-4802-82df-3d2d741ec940/features.json?key=RZxGqTFix5IeutYU7exD", //URL donde estan todos los datos
        });
      }
      //capa
      CapaIconos(map);
      //eventos

      //cerrar la capa
    } else if (map && urbansImagen) {
      //si hay mapa y urbansOpen=false
      if (map.getSource("Iconos")) {
        //si el mapa es esa fuente que entra por parametro
        map.removeSource("Iconos"); //elimina la fuente =>id=fuente
      }
    }
  };
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
      <div className={stylesSelectMap.container}>
        <div>
          {/**MapOriginal------------------------- */}
          <div className={stylesSelectMap.list}>
            <div>Mapa original</div>
            <div></div>
          </div>
          {/**MapCluster------------------------- */}
          <div className={stylesSelectMap.list} onClick={handleLayerCluster}>
            <div>Cluster de terremotos</div>
            <div>
              {clusterOpen ? ( // Si clusterOpen es true, muestra VisibilityIcon
                <div>
                  <VisibilityIcon />
                </div>
              ) : (
                // Si clusterOpen es false, muestra VisibilityOffIcon
                <div>
                  <VisibilityOffIcon />
                </div>
              )}
            </div>
          </div>
          {/**MapUrban------------------------- */}
          <div className={stylesSelectMap.list} onClick={handleLayerurbans}>
            <div>Zonas urbanas</div>
            <div>
              {urbansOpen ? ( // Si clusterOpen es true, muestra VisibilityIcon
                <div>
                  <VisibilityIcon />
                </div>
              ) : (
                // Si clusterOpen es false, muestra VisibilityOffIcon
                <div>
                  <VisibilityOffIcon />
                </div>
              )}
            </div>
          </div>
          {/**MapBosque------------------------- */}
          <div className={stylesSelectMap.list} onClick={handleLayerBosque}>
            <div>Bosque</div>
            <div>
              {urbansBosque ? ( // Si clusterOpen es true, muestra VisibilityIcon
                <div>
                  <VisibilityIcon />
                </div>
              ) : (
                // Si clusterOpen es false, muestra VisibilityOffIcon
                <div>
                  <VisibilityOffIcon />
                </div>
              )}
            </div>
          </div>
          {/**MapRutas------------------------- */}
          <div className={stylesSelectMap.list}>
            <div>Rutas</div>
            <div>
              {urbansRutas ? ( // Si clusterOpen es true, muestra VisibilityIcon
                <div>
                  <VisibilityIcon />
                </div>
              ) : (
                // Si clusterOpen es false, muestra VisibilityOffIcon
                <div>
                  <VisibilityOffIcon />
                </div>
              )}
            </div>
          </div>
          {/**MapImagen------------------------- */}
          <div className={stylesSelectMap.list} onClick={handleLayerImagen}>
            <div>Imagen</div>
            <div>
              {urbansImagen ? ( // Si clusterOpen es true, muestra VisibilityIcon
                <div>
                  <VisibilityIcon />
                </div>
              ) : (
                // Si clusterOpen es false, muestra VisibilityOffIcon
                <div>
                  <VisibilityOffIcon />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapPrincipal;
