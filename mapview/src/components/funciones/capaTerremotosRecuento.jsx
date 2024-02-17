//esta capa muestra clusters de terremotos como círculos, con e color y el tamaño de los circulos
//ajustados dinamicamente según la cantidad de terremotos en cada cluster.
const CapaTerremotosRecuento = () => {
  return {
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
  };
};

export default CapaTerremotosRecuento;
