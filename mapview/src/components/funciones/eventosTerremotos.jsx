// Función para manejar el clic en clusters
import mapboxgl from "mapbox-gl";
export const handleClusterClick = (map) => {
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map.getSource("earthquakes").getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
    });
  };
  
  // Función para manejar el clic en puntos no agrupados
  export const handleUnclusteredPointClick = (map) => {
    let popup = new mapboxgl.Popup();

    map.on("click", "unclustered-point", (e) => {
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

  // Función para manejar el evento de entrada en clusters
  export const handleClusterMouseEnter = (map) => {
    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
  };
  
  // Función para manejar el evento de salida de clusters
  export const handleClusterMouseLeave = (map) => {
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
  };