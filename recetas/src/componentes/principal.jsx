import "../css/flex.css";
import "../css/estilos.css";
import portada from "../imagenes/principal.jpg";
import imagen1 from "../imagenes/receta1.jpg";
import imagen2 from "../imagenes/receta2.jpg";
import { Titulo } from "./index";

function Principal() {
  return (
    <>
      <div className="bordeContainer">
        <div className="container">          
          <img src={portada} alt="portada" />
          <div className="boxHorizontal">
            <img src={imagen1} className="containerImg" alt="receta1" />
            <img src={imagen2} className="containerImg marginLeft"  alt="receta2" />
          </div>
          <div className="containerTitulo">
            <Titulo />
          </div>
        </div>
      </div>
    </>
  );
}

export default Principal;
