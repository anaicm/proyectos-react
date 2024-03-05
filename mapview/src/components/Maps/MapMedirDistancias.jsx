//mostrar el mapa en la web normal en la web
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
//import geojson from "../data/DataIcons";
import "../../Map.css";
import * as turf from "@turf/turf";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapDistancias = () => {
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
    const distanceContainer = document.getElementById("distance");

    // GeoJSON object to hold our measurement features
    const geojson = {
      type: "FeatureCollection",
      features: [],
    };

    const linestring = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    };

    map.on("style.load", () => {
      map.addSource("urban-distancias", {
        type: "geojson", //formato de lo que viene por la api
        data: "http://localhost:3000/provinciasEspanolas.geojson", //URL donde estan todos los datos
      });
      //Objeto geojson que define el componente
      map.addSource("geojson", {
        type: "geojson",
        data: geojson,
      });
      //capas
      map.addLayer({
        id: "popup-layer",
        type: "circle",
        source: "urban-distancias",
        paint: {
          "circle-radius": 0,
          "circle-opacity": 0, // Hacer la capa completamente transparente
        },
        filter: ["in", "$type", "Point"],
      });
      //capa para los puntos
      map.addLayer({
        id: "points",
        type: "circle",
        source: "geojson",
        paint: {
          "circle-radius": 5, //define el radio
          "circle-color": "#fff", //define el color
          "circle-stroke-color": "#000", //define el borde del círculo
          "circle-stroke-width": 3, //define el ancho
        },
        filter: ["in", "$type", "Point"],
      });
      //capa para la lína que va de un punto a otro
      map.addLayer({
        id: "measure-lines",
        type: "line",
        source: "geojson",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#000",
          "line-width": 3,
        },
        filter: ["in", "$type", "LineString"],
      });
    });
    //eventos
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });
    map.on("mouseenter", "points", (e) => {
      map.getCanvas().style.cursor = "pointer";
      const coordinates = e.features[0].geometry.coordinates.slice();//saca las coordenadas de los puntos

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      popup.setLngLat(coordinates).setHTML(coordinates).addTo(map);
    });
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = ""; // Restaurar cursor por defecto
      popup.remove();
    });

    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["points"],
      });
      if (geojson.features.length > 1) geojson.features.pop();
      // limpia el valor
      distanceContainer.innerHTML = "";
      if (features.length) {
        const id = features[0].properties.id;
        geojson.features = geojson.features.filter(
          (point) => point.properties.id !== id
        );
      } else {
        const point = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          },
          properties: {
            id: String(new Date().getTime()),
          },
        };

        geojson.features.push(point);
      }
      if (geojson.features.length > 1) {
        linestring.geometry.coordinates = geojson.features.map(
          (point) => point.geometry.coordinates
        );

        geojson.features.push(linestring);

        // Populate the distanceContainer with total distance
        const value = document.createElement("pre");
        const distance = turf.length(linestring);
        value.textContent = `Total distance: ${distance.toLocaleString()}km`;
        distanceContainer.appendChild(value);
      }
      map.getSource("geojson").setData(geojson);
    });
    map.on("mousemove", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["points"],
      });
      // Change the cursor to a pointer when hovering over a point on the map.
      // Otherwise cursor is a crosshair.
      map.getCanvas().style.cursor = features.length ? "pointer" : "crosshair";
    });

    setMap(map);
    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
      <div id="distance"></div> {/* Agrega este div */}
    </div>
  );
};

export default MapDistancias;
