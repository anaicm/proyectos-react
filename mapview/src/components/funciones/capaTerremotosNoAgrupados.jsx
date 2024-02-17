//esta capa muestra clusters de terremotos como círculos, con e color y el tamaño de los circulos
//ajustados dinamicamente según la cantidad de terremotos en cada cluster.
const CapaTerremotosNoAgrupados = () => {
  return {
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
  };
};

export default CapaTerremotosNoAgrupados;
