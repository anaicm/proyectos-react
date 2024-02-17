//esta capa muestra clusters de terremotos como círculos, con e color y el tamaño de los circulos
//ajustados dinamicamente según la cantidad de terremotos en cada cluster.
const CapaTerremotos = () => {
  return {
    id: "clusters", //Asigna un identificador único a esta capa.
    type: "circle", //tipo circulo
    source: "earthquakes", //"earthquakes" => fuente de archivo GeoJson de terremotos
    //has => tiene, si hay puntos, cuenta los puntos =>
    filter: ["has", "point_count"], //=> point_count => cuenta los puntos que hay en un cluster
    paint: {
      //el color y el radio depende del recuento de puntos en el cluster
      "circle-color": [
        "step",
        ["get", "point_count"],//'point_count'=> realiza el recuento de cluster
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
  };
};

export default CapaTerremotos;
