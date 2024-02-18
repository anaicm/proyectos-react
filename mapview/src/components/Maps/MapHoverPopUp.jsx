//mostrar el mapa en la web normal en la web

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import "../../Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapHoverPopUP = () => {
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
      center: [-77.04, 38.907], //latitud y longitud
      zoom: 11.15, //donde va a cargar el mapa inicial
    });
    map.on(
      "load",
      () => {
        map.addSource("places", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-77.038659, 38.931567],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a Mad Men Season Five Finale Watch Party, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-77.003168, 38.894651],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a Big Backyard Beach Bash and Wine Fest on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.</p>",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-77.090372, 38.881189],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Ballston Arts & Crafts Market</strong><p>The Ballston Arts & Crafts Market sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-77.111561, 38.882342],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year's Seersucker Social bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-77.052477, 38.943951],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Capital Pride Parade</strong><p>The annual Capital Pride Parade makes its way through Dupont this Saturday. 4:30 p.m. Free.</p>",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-77.043444, 38.909664],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist Muhsinah plays the Black Cat (1811 14th Street NW) tonight with Exit Clov and Gods’illa. 9:00 p.m. $12.</p>",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-77.031706, 38.914581],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>A Little Night Music</strong><p>The Arlington Players' production of Stephen Sondheim's <em>A Little Night Music</em> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-77.020945, 38.878241],
                },
              },
              {
                type: "Feature",
                properties: {
                  description:
                    "<strong>Truckeroo</strong><p>Truckeroo brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>",
                },
                geometry: {
                  type: "Point",
                  coordinates: [-77.007481, 38.876516],
                },
              },
            ],
          },
        });

        map.addLayer({
          id: "places",
          type: "circle",
          source: "places",
          paint: {
            "circle-color": "#4264fb",
            "circle-radius": 6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        });
        // new mapboxgl.Popup(): Crea una nueva instancia de la clase Popup proporcionada
        //por la biblioteca Mapbox GL. Esta clase representa un mensaje emergente que se puede
        //mostrar en el mapa.
        const popup = new mapboxgl.Popup({
          //closeButton: false => configura si se muestra un botón para cerrar el popup. 
          //Aquí se establece en false, lo que significa que no se mostrará un botón de 
          //cierre en el popup.
          closeButton: false,
          //closeOnClick: false => Esta opción configura si el popup se cierra cuando se hace 
          //clic fuera de él. Aquí se establece en false, lo que significa que el popup no se 
          //cerrará cuando se haga clic en cualquier otro lugar del mapa.
          closeOnClick: false,
        });

        map.on("mouseenter", "places", (e) => {
          // Change the cursor style as a UI indicator.
          map.getCanvas().style.cursor = "pointer";

          // Copy coordinates array.
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });

        map.on("mouseleave", "places", () => {
          map.getCanvas().style.cursor = "";
          popup.remove();
        });
        setMap(map);
        // Clean up on unmount
        return () => map.remove();
      },
      []
    );
  });
  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapHoverPopUP;
