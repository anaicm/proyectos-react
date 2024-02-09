import style from "../css/recetas.module.css";

function RecetaSegunda() {
  return (
    <>
      <div className="">
        <div className={style.tituloReceta}>
          2. Ensalada de Quinoa con Aguacate y Frijoles Negros
        </div>
        <h3>Ingredientes:</h3>
        <p>
          1 taza de quinoa, enjuagada <br />
          2 tazas de agua o caldo de verduras <br />
          1 aguacate maduro, cortado en cubos <br />
          1 lata (400g) de frijoles negros, escurridos y enjuagados <br />
          1 pimiento rojo, cortado en cubitos <br />
          1 pimiento verde, cortado en cubitos <br />
          1/2 taza de cilantro fresco, picado <br />
          1/4 taza de jugo de limón
          <br />
          2 cucharadas de aceite de oliva Sal y pimienta al gusto <br />
        </p>

        <h3>Instrucciones:</h3>
        <p>
          En una olla mediana, hierve el agua o caldo de verduras. Agrega la
          quinoa y reduce el fuego a bajo. Cocina tapado durante unos 15-20
          minutos, o hasta que la quinoa esté tierna y todo el líquido se haya
          absorbido. Retira del fuego y deja reposar tapado durante unos
          minutos. Mientras la quinoa se cocina, prepara los ingredientes
          restantes. En un tazón grande, combina la quinoa cocida, los cubos de
          aguacate, los frijoles negros, los pimientos y el cilantro. En un
          tazón pequeño, mezcla el jugo de limón, el aceite de oliva, la sal y
          la pimienta. Vierte esta vinagreta sobre la ensalada y revuelve
          suavemente para combinar. Prueba y ajusta la sazón si es necesario.
          Sirve la ensalada de quinoa fría o a temperatura ambiente como plato
          principal o acompañamiento. ¡Buen provecho!
        </p>
      </div>
    </>
  );
}

export default RecetaSegunda;
