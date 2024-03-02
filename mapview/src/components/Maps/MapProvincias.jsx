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
  const [selectedRegion, setSelectedRegion] = useState(2);
  const [selectedColor, setSelectedColor] = useState("#00FF00"); // Estado para almacenar los colores de cada provincia
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
    let hoveredPolygonId = null;
    map.on("style.load", () => {
      map.addSource("urban-provincias", {
        type: "geojson", //formato de lo que viene por la api
        data: "http://localhost:3000/provinciasEspanolas.geojson", //URL donde estan todos los datos
      });
      map.addLayer({
        //capa para el relleno del poligono
        id: "urban-provincias-layer",
        type: "fill",
        slot: "bottom",
        source: "urban-provincias",
        //filter: ["!=", ["get", "id"], selectedRegion],
        layout: {},
        paint: {
          //"fill-color": "#627BC1",
          "fill-color": ["get", "color"], // Obtener el color de la propiedad "color" de cada provincia

          //"fill-color": [
          //"case",
          //["==", ["get", "id"], selectedRegion], // Comprueba si es la región seleccionada
          //"red", // Si es la región seleccionada, colorea diferente al recargar la página
          //"#627BC1",
          //],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.7,
            0.2,
          ],
        },
      });
      map.addLayer({
        //capa para el borde del poligono
        id: "state-borders",
        type: "line",
        slot: "bottom",
        source: "urban-provincias",
        filter: ["!=", ["get", "id"], selectedRegion],
        layout: {},
        paint: {
          "line-color": "white", //=> poner solo un color
          // "line-color": [
          //   //si hace hover cambiar el color del borde a blanco de #627BC1
          //   "case",
          //   ["boolean", ["feature-state", "hover"], false],
          //   "white",
          //   "#627BC1",
          // ],
          //"line-width": 1,
          "line-width": [
            //si hace hover cambia el ancho del borde a 2 de 1
            "case",
            ["boolean", ["feature-state", "hover"], false],
            3,
            1,
          ],
        },
      });
      map.addLayer({
        //capa para el borde del poligono que esta seleccionado en el estado selectedRegion
        id: "selecter-provincia-borders",
        type: "line",
        slot: "top",
        source: "urban-provincias",
        filter: ["==", ["get", "id"], selectedRegion],
        layout: {},
        paint: {
          //"line-color": "#627BC1",=> poner solo un color
          "line-color": "white",
          //"line-width": 2,
          "line-width": 8,
        },
      });
      map.addLayer({
        //capa para el inicio de la pagina que la region salga marcada en el estado selectedRegion
        id: "selecte-provincia-layer",
        type: "fill",
        source: "urban-provincias",
        slot: "bottom",
        filter: ["==", ["get", "id"], selectedRegion],
        layout: {},
        paint: {
          //"fill-color": "#627BC1",
          "fill-color": selectedColor,
          // "fill-color": [
          //   "case",
          //   ["==", ["get", "id"], selectedRegion],
          //   selectedColor, // Usar el color de la provincia seleccionada
          //   "#627BC1", // Color predeterminado
          // ],
          "fill-opacity": 1,
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      // map.on("click", "hover-provincia-layer", (e) => {
      //     const clickedFeature = e.features[0];
      //     const provinciaColor = clickedFeature.properties.color;
      //     setSelectedColor(provinciaColor);
      // });
      map.on("click", "urban-provincias-layer", (e) => {
        // Obtener el color de la provincia seleccionada y actualizar el estado
        const clickedFeature = e.features[0];
        const provinciaColor = clickedFeature.properties.color;
        map.setPaintProperty(
          "selecte-provincia-layer",
          "fill-color",
          provinciaColor
        );
        const featureId = e.features[0].id;
        setTimeout(() => {
          //setSelectedRegion(featureId);
          map.setFilter("selecte-provincia-layer", [
            "==",
            ["get", "id"],
            featureId,
          ]);
          map.setFilter("selecter-provincia-borders", [
            "==",
            ["get", "id"],
            featureId,
          ]);
        }, 200); // 200ms de retraso

        //setSelectedColor(provinciaColor);
      });
      //evento para cambiar la opacidad solo del id donde se encuentre el raton (hover)
      map.on("mousemove", "urban-provincias-layer", (e) => {
        if (e.features.length > 0) {
          if (
            hoveredPolygonId !== null &&
            hoveredPolygonId !== selectedRegion
          ) {
            map.setFeatureState(
              { source: "urban-provincias", id: hoveredPolygonId },
              { hover: false }
            );
          }

          hoveredPolygonId = e.features[0].id;

          map.setFeatureState(
            { source: "urban-provincias", id: hoveredPolygonId },
            { hover: true }
          );
        }
      });
      //cuando el raton sale de la feature vuelve a ponerla en su estado inicial sin hover
      map.on("mouseleave", "urban-provincias-layer", () => {
        //si el id es distinto de null (hay id) => quita el hover (a todos los que tienen hover)
        //y si el valor del estado selectedRegion es distinto al id no lo apagues (no quites el hover)
        if (hoveredPolygonId !== null && hoveredPolygonId !== selectedRegion) {
          map.setFeatureState(
            { source: "urban-provincias", id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });

      //evento para mostrar el popup con el hover
      map.on("mousemove", "urban-provincias-layer", (e) => {
        //coge la propiedad del json en este caso "provincia"
        const provinceName = e.features[0].properties.provincia;
        //la añade al mapa la propiedad.
        popup.setLngLat(e.lngLat).setHTML(provinceName).addTo(map);
        map.getCanvas().style.cursor = "pointer"; // Cambiar cursor a pointer
      });
      //elimina el pop up cuando el raton sale del área y vuelve el cursor a su forma original
      map.on("mouseleave", "urban-provincias-layer", () => {
        map.getCanvas().style.cursor = ""; // Restaurar cursor por defecto
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
