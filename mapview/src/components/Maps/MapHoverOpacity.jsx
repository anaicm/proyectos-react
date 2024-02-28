//mostrar el mapa en la web normal en la web

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "../../Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapHoverOpacity = () => {
  //declara un estado para el contenedor que guarda el mapa que se devuelve despues en el return.
  const mapContainerRef = useRef(null);//se tiene que poner 
  const [map, setMap] = useState(null);//constante para guardar el mapa
 
  // Initialize map when component mounts
  useEffect(() => {
    //la primera vez que carga el componente map, no tiene dependencias []
    //constante que inicializa el map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12", //https://docs.mapbox.com/api/maps/styles/
      center: [-100.486052, 37.830348], //latitud y longitud
      zoom: 2, //donde va a cargar el mapa inicial
    });
    let hoveredPolygonId = null;
    map.on('load', () => {
      map.addSource('states', {
          'type': 'geojson',
          'data': 'http://localhost:3000/coords.geojson'
      });

      // The feature-state dependent fill-opacity expression will render the hover effect
      // when a feature's hover state is set to true.
      map.addLayer({
          'id': 'state-fills',
          'type': 'fill',
          'source': 'states',
          'layout': {},
          'paint': {
              'fill-color': '#627BC1',
              'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  1,
                  0.5
              ]
          }
      });

      map.addLayer({
          'id': 'state-borders',
          'type': 'line',
          'source': 'states',
          'layout': {},
          'paint': {
              'line-color': '#627BC1',
              'line-width': 2
          }
      });

      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      map.on('mousemove', 'state-fills', (e) => {
          if (e.features.length > 0) {
              if (hoveredPolygonId !== null) {
                  map.setFeatureState(
                      { source: 'states', id: hoveredPolygonId },
                      { hover: false }
                  );
              }
              hoveredPolygonId = e.features[0].id;
              map.setFeatureState(
                  { source: 'states', id: hoveredPolygonId },
                  { hover: true }
              );
          }
      });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      map.on('mouseleave', 'state-fills', () => {
          if (hoveredPolygonId !== null) {
              map.setFeatureState(
                  { source: 'states', id: hoveredPolygonId },
                  { hover: false }
              );
          }
          hoveredPolygonId = null;
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

export default MapHoverOpacity;
