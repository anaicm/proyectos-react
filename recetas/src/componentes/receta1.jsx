import style from "../css/recetas.module.css";

function PrimeraReceta() {
  return (
    <>
      <div className="containerReceta">
        <div className={style.tituloReceta}>1. Pollo al Curry con Verduras</div>
        <h3>Ingredientes:</h3>
        <p className={style.textoReceta}>
          500g de pechugas de pollo, cortadas en trozos
          <br />
          1 cebolla, picada
          <br />
          2 dientes de ajo, picados
          <br />
          1 zanahoria, cortada en rodajas finas
          <br />
          1 pimiento rojo, cortado en tiras
          <br />
          1 pimiento verde, cortado en tiras
          <br />
          400ml de leche de coco
          <br />
          2 cucharadas de pasta de curry rojo
          <br />
          2 cucharadas de aceite de oliva
          <br />
          Sal y pimienta al gusto
          <br />
          Arroz blanco cocido para servir
          <br />
        </p>
        <h3>Instrucciones:</h3>
        <p className={style.textoReceta}>
          Calienta el aceite en una sartén grande a fuego medio. Agrega la
          cebolla y el ajo, y cocina hasta que estén dorados y fragantes. Añade
          los trozos de pollo a la sartén y cocina hasta que estén dorados por
          todos lados. <br />
          Agrega los pimientos y la zanahoria a la sartén y cocina
          por unos minutos más, hasta que las verduras estén ligeramente
          tiernas. 
          <br />Agrega la pasta de curry rojo a la sartén y revuelve para
          cubrir todos los ingredientes. Vierte la leche de coco en la sartén y
          mezcla bien. 
          <br />Deja que la mezcla hierva y luego reduce el fuego a bajo.<br />
          Cocina a fuego lento durante unos 15-20 minutos, o hasta que el pollo
          esté completamente cocido y las verduras estén tiernas.<br /> 
          Prueba y
          ajusta la sazón con sal y pimienta según sea necesario. <br />
          Sirve el pollo
          al curry caliente sobre arroz blanco cocido. <br />
          ¡Disfruta!
        </p>
      </div>
    </>
  );
}

export default PrimeraReceta;
