//mostrar el mapa en la web normal en la web
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
//import geojson from "../data/DataIcons";
import "../../Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapComunidades = () => {
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
   
    map.on("style.load", () => {
      map.addSource("urban-provincias", {
        type: "geojson", //formato de lo que viene por la api
        data: "http://localhost:3000/provinciasEspanolas.geojson", //URL donde estan todos los datos
      });
      

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

 
    });

    setMap(map);
    // Clean up on unmount
    return () => map.remove();
  }, [selectedRegion, selectedColor]);

  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapComunidades;
