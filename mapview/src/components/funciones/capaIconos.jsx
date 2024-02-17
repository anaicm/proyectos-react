import mapboxgl from "mapbox-gl";
import geojson from "../data/DataIcons";
import {getImage} from '../funciones'

const CapaIconos = (map) => {
  //onst ret[] = {el, marker.geometry.coordinates};
  for (const marker of geojson.features) {
    const el = document.createElement("div");
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    const background = marker.properties.imagen; 


    el.className = "marker";
    el.style.backgroundImage = `url(${getImage(background)})`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = "100%";
    el.addEventListener("click", () => {
      window.alert(marker.properties.message);
    });
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
  }
};

export default CapaIconos;