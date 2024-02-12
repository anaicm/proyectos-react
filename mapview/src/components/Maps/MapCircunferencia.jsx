import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "../../Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxlamFuZHJvLXBlcmV6IiwiYSI6ImNsczNrZG5kNDAwazQyaW84d21zeXViNDAifQ.LguyBzAlUB2A7aCRp0tTjQ";

const MapCircunferencia = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainerRef }) => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 40],
        zoom: 1,
      });
      //una vez el mapa esta cargado no ('map.on("load",...)) se agregan las capas => layers
      map.on("load", () => {
        map.addSource("earthquakes", {
          type: "geojson",
          data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
          cluster: true, //clusterizar es agrupar cosas en una circunferencia
          clusterMaxZoom: 14, //minimo de cuando te acercas, si te acercas 14 no se ve ningun cluster
          clusterRadius: 250, //radio de la circunferencia que abarca
        });

        map.addLayer({
          id: "clusters", //Asigna un identificador único a esta capa.
          type: "circle", //tipo circulo
          source: "earthquakes", //"earthquakes" => fuente de archivo GeoJson de terremotos
          //has => tiene, si hay puntos, cuenta los puntos =>
          filter: ["has", "point_count"], //=> point_count => cuenta los puntos que hay en un cluster
          paint: {
            //el color y el radio depende del recuento de puntos en el cluster
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6", //si es menor a 100 puntos pintas estes color
              100,
              "#f1f075", //si es menor a 750 puntos pintas estes color
              750,
              "#f28cb1", //si es más grande puntos pintas estes color
            ],
            //esta parte ajusta dinámicamente el tamaño de los circulos en función del número de
            //puntos en el cluster, cuantos más puntos más grande es el radio.
            //["step", ["get", "point_count"], 20, 100, 30, 750, 40] es una expresión de Mapbox GL JS que ajusta el radio
            //del círculo según el recuento de puntos en el cluster.
            "circle-radius": [
              //"circle-radius" es una propiedad que define el radio de los círculos en la capa del mapa.
              "step", //=>"step" es un tipo de función que se utiliza para asignar valores a una propiedad en función de una expresión.
              ["get", "point_count"], //=>  obtiene el recuento de puntos en el cluster.
              20,
              100,
              30,
              750,
              40,
            ], //=> representan pares de valores. El primer valor de cada par es el límite inferior
            //del recuento de puntos, y el segundo valor es el radio que se asignará a los círculos
            // cuando el recuento de puntos esté dentro de ese rango.
            /**En este caso, el código se interpreta de la siguiente manera:
             * Si el recuento de puntos es menor que 100, el radio del círculo es 20.
             * Si el recuento de puntos está entre 100 y 749, el radio del círculo es 30.
             * Si el recuento de puntos es 750 o más, el radio del círculo es 40. */
          },
        });
        //esta capa añade etiquetas de texto que muestran el recuento de puntos en cada cluster en el mapa.
        map.addLayer({
          id: "cluster-count", //Asigna un identificador único a esta capa.
          type: "symbol", //Especifica el tipo de capa que se va a agregar. En este caso, es "symbol",
          //lo que significa que se trata de una capa que muestra símbolos de texto.
          source: "earthquakes",
          //filter: ["has", "point_count"]: Aplica un filtro a esta capa para que solo se muestre
          //cuando un cluster tiene un recuento de puntos. Esto asegura que solo se muestre el
          //recuento de puntos en los clusters y no en los puntos individuales.
          filter: ["has", "point_count"],
          //layout: { ... }: Define el diseño de la capa.
          layout: {
            //"text-field": ["get", "point_count_abbreviated"]: Especifica el texto que se mostrará
            //en la capa. En este caso, se utiliza el valor de la propiedad "point_count_abbreviated"
            // de cada feature en el cluster para mostrar el recuento de puntos. Es probable que
            //"point_count_abbreviated" contenga el recuento de puntos formateado de alguna manera.
            "text-field": ["get", "point_count_abbreviated"],
            //"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"]: Define la fuente
            //del texto que se va a mostrar.
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            //"text-size": 12: Especifica el tamaño del texto que se va a mostrar, en este caso, 12 píxeles.
            "text-size": 12,
          },
        });
        //esta capa agrega puntos individuales al mapa para representar terremotos que no están agrupados en un cluster,
        //con un estilo de círculo y un borde blanco.
        map.addLayer({
          id: "unclustered-point", //Asigna un identificador único a esta capa.
          type: "circle", // el tipo de capa que se va a agregar. En este caso, es "circle",
          //lo que significa que se trata de una capa que muestra círculos.
          source: "earthquakes",
          //filter: ["!", ["has", "point_count"]]: Aplica un filtro a esta capa para que solo se
          //muestren los puntos que no están agrupados en un cluster.
          filter: ["!", ["has", "point_count"]], // =>  niega la condición de tener un punto de recuento, lo que significa que solo se mostrarán
          //los puntos individuales que no están en un cluster.
          paint: {
            //=> Define el estilo de pintura de la capa.
            "circle-color": "#11b4da", //Especifica el color base de los círculos (azul claro)
            "circle-radius": 4, // Define el radio de los círculos
            "circle-stroke-width": 1, //Especifica el ancho del borde de los círculos
            "circle-stroke-color": "#fff", //Define el color del borde de los círculos (blanco)
          },
        });

        //escuchadores de eventos para manejar clics, eventos de mouse y otra interacciones del usuario.
        // este bloque de código permite que el mapa se centre y se amplíe al hacer clic (zoom)
        //en un cluster, mostrando los puntos individuales que se agrupan dentro de él.
        map.on("click", "clusters", (e) => {
          //const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });:
          //Utiliza el método queryRenderedFeatures del mapa para obtener las características
          //renderizadas en la posición donde se hizo clic. Solo se buscan características en
          //la capa "clusters".
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["clusters"],
          });
          //const clusterId = features[0].properties.cluster_id;: Obtiene el identificador
          // del cluster al que pertenece la primera característica encontrada.
          //Esto se hace accediendo a la propiedad cluster_id del objeto properties de la
          //característica.
          const clusterId = features[0].properties.cluster_id;
          //map.getSource("earthquakes").getClusterExpansionZoom(clusterId, (err, zoom) => { ... }):
          // Utiliza el método getClusterExpansionZoom del origen de datos "earthquakes"
          //para obtener el nivel de zoom en el que el cluster se expandirá cuando se haga clic en él. Este método devuelve el nivel de zoom y maneja los errores mediante un callback.
          map
            .getSource("earthquakes")
            .getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) return;
              //map.easeTo({ center: features[0].geometry.coordinates, zoom: zoom });:
              // Utiliza el método easeTo del mapa para animar la transición del mapa a
              //la ubicación del cluster y al nivel de zoom calculado anteriormente.
              map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom,
              });
            });
        });
        //este bloque de código muestra un Popup con información detallada sobre un terremoto
        //específico cuando se hace clic en su punto en el mapa.
        map.on("click", "unclustered-point", (e) => {
          //const coordinates = e.features[0].geometry.coordinates.slice();:
          //Extrae las coordenadas geográficas del punto en el que se hizo clic y las guarda
          //en la variable coordinates. e.features[0] representa la primera característica
          //seleccionada por el clic, y geometry.coordinates contiene las coordenadas de esa
          //característica. Se utiliza .slice() para obtener una copia del array de coordenadas.
          const coordinates = e.features[0].geometry.coordinates.slice();
          //const mag = e.features[0].properties.mag;: Extrae la magnitud del terremoto del
          //punto en el que se hizo clic y la guarda en la variable mag.
          //e.features[0].properties.mag accede al valor de la propiedad "mag" de la
          //característica seleccionada.
          const mag = e.features[0].properties.mag;
          //const tsunami = e.features[0].properties.tsunami === 1 ? "yes" : "no";:
          //Verifica si la propiedad "tsunami" de la característica seleccionada tiene un
          //valor de 1 (indicando que hubo un tsunami) y asigna "yes" a la variable tsunami,
          //de lo contrario asigna "no".
          const tsunami = e.features[0].properties.tsunami === 1 ? "yes" : "no";
          //El bucle while que sigue se asegura de que las coordenadas estén dentro del rango 
          //válido de longitud (-180 a 180 grados) al realizar ajustes necesarios.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          //new mapboxgl.Popup()...addTo(map);: Crea una nueva instancia de un objeto Popup de Mapbox
          // GL JS y lo agrega al mapa. Este Popup muestra información sobre el terremoto en el punto
          // en el que se hizo clic, incluyendo su magnitud y si hubo un tsunami.
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
            .addTo(map);
        });
        //este bloque de código cambia el estilo del cursor del mouse a "pointer" 
        //cuando el cursor entra en un cluster del mapa, proporcionando una indicación visual 
        //de que el cluster es interactivo y se puede hacer clic en él.
        //--map.on("mouseenter", "clusters", () => { ... }): Establece un controlador de eventos 
        //para el evento de "mouseenter" en los clusters del mapa. Cuando el cursor del mouse 
        //entra en un cluster, se ejecuta la función proporcionada.
        map.on("mouseenter", "clusters", () => {
          //map.getCanvas().style.cursor = "pointer";: Cambia el estilo del cursor del mapa a 
          //"pointer" cuando el cursor del mouse entra en un cluster. Esto cambia la apariencia 
          //del cursor a una mano, lo que indica que el elemento sobre el que está el cursor es 
          //interactivo y se puede hacer clic en él.
          map.getCanvas().style.cursor = "pointer";
        });
        //este bloque de código restaura el estilo del cursor del mouse a su valor predeterminado 
        //cuando el cursor sale de un cluster del mapa, lo que indica que el elemento ya no es 
        //interactivo y no se puede hacer clic en él.
        //--map.on("mouseleave", "clusters", () => { ... }): Establece un controlador de eventos 
        //para el evento de "mouseleave" en los clusters del mapa. Cuando el cursor del mouse sale 
        //de un cluster, se ejecuta la función proporcionada.
        map.on("mouseleave", "clusters", () => {
          //map.getCanvas().style.cursor = "";: Restablece el estilo del cursor del mapa a su valor 
          //predeterminado cuando el cursor del mouse sale de un cluster. Al establecerlo en una 
          //cadena vacía, se restablece a su valor predeterminado, lo que suele ser una flecha.
          map.getCanvas().style.cursor = "";
        });
      });

      setMap(map);//actualiza el mapa en la constante setMap
    };
    //actualiza el estado del mapa, utilizando la función 'setMap' proporcionada por el hook 'useState'
    //para almacenar la instancia del mapa.
    if (!map) initializeMap({ setMap, mapContainerRef });
  }, [map]);
  //Se utiliza un segundo efecto useEffect para limpiar el mapa cuando el componente se desmonta.
  //Esto asegura que la instancia del mapa se elimine correctamente para evitar pérdidas de memoria
  //o errores.
  useEffect(() => {
    return () => {
      if (map) map.remove();
    };
  }, [map]);
  //Finalmente, el componente devuelve un elemento <div> que contiene el contenedor del mapa,
  //haciendo referencia a mapContainerRef
  return (
    <div>
      <div ref={mapContainerRef} className="map-container" />
    </div>
  );
};

export default MapCircunferencia;
