//Cuando el mouse entra en uno de estos elementos, cambia el estilo del cursor a "pointer",
//obtiene las coordenadas y la descripción del elemento sobre el cual se encuentra el mouse,
//ajusta las coordenadas si es necesario y muestra un popup con la descripción en esa posición del mapa.
import mapboxgl from "mapbox-gl";


 // Función para manejar el clic en puntos no agrupados
 export const handleUnclusteredPointHover = (map) => {
  let popup = new mapboxgl.Popup();

  map.on("mouseenter", "unclustered-point", (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const mag = e.features[0].properties.mag;
    const tsunami = e.features[0].properties.tsunami === 1 ? "yes" : "no";
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    popup
      .setLngLat(coordinates)
      .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
      .addTo(map);
  });

  map.on("mouseleave", "unclustered-point", (e) => {
    popup.remove();
  });
};
// Función que crea el popup y configura los eventos de mouse
export function SetupPopup(map) {
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

  //Este código agrega un evento "mouseenter" al mapa para los elementos que tienen
  //el nombre "earthquakes" => es el id del layer, la capa donde se quiere usar el hover,
  //por lo que siempre hay que cambiarlo para que coincida con la capa a la que se aplica.
  // Cuando el mouse entra en uno de estos elementos, se ejecutará
  //la función de devolución de llamada.
  map.on("mouseenter", "earthquakes", (e) => {
    //Esta línea cambia el estilo del cursor del mapa a "pointer" cuando el mouse entra
    //en un elemento "nomId", del layer lo que indica que el cursor se convertirá en una mano
    //cuando esté sobre el elemento.
    map.getCanvas().style.cursor = "pointer";
    //Esta línea obtiene las coordenadas del primer elemento dentro del evento "e", que es
    //el evento de mouse que desencadenó la función de devolución de llamada.
    //Estas coordenadas representan la posición del mouse en el mapa.
    const coordinates = e.features[0].geometry.coordinates.slice();
    //Esta línea obtiene la descripción del primer elemento dentro del evento "e".
    //La descripción probablemente está relacionada con el elemento del mapa sobre el
    //cual se encuentra el mouse.
    const description = e.features[0].properties.description;
    //Este bucle while ajusta las coordenadas de manera que, si el mapa está suficientemente
    //alejado (más allá de 180 grados de longitud), las coordenadas se ajustan para asegurarse
    // de que el popup aparezca correctamente en el mapa, evitando problemas de visualización
    //alrededor del meridiano de cambio de fecha.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    //Esta línea establece la posición y el contenido HTML del popup y lo agrega al mapa.
    //El popup se colocará en las coordenadas donde se encuentra el mouse y mostrará la
    //descripción obtenida del elemento del mapa
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });
  /** Cuando el mouse sale de uno de estos elementos, restablece el estilo del cursor 
   * y elimina cualquier popup que esté siendo mostrado en el mapa 
   * */
  //Este código agrega un evento "mouseleave" al mapa para los elementos que tienen el
  //nombre "earthquakes" => id del layer. Cuando el mouse sale de uno de estos elementos,
  //se ejecutará la función de devolución de llamada.
  map.on("mouseleave", "earthquakes", () => {
    //establece el estilo del cursor del mapa en una cadena vacía, lo que probablemente
    //restablece el estilo del cursor a su valor predeterminado.
    map.getCanvas().style.cursor = "";
    //elimina el popup del mapa. Si había un popup mostrándose cuando el mouse 
    //salió del elemento "places", este código lo quitará del mapa.
    popup.remove();
  });
}

