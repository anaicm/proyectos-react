const UrbanAreasLayer = () => {
    return {
      id: "urban-areas-fill",
      type: "fill",
      slot: "middle",
      source: "urban-areas",
      layout: {},
      paint: {
        "fill-color": "#f08",
        "fill-opacity": 0.4,
      },
    };
  };
  
  export default UrbanAreasLayer;