import "../css/titulo.css";
import "../css/flex.css";
import "../css/estilos.css";
import { RecetaPrimera, RecetaSegunda } from "./index";

function Titulo() {
  return (
    <>
      <main>
        <section>
          <div>
            <h1>
              <span>Tu canal de cocina</span>
              <span>Recetas fáciles</span>
            </h1>
          </div>
        </section>
        <section>
          <div className="containerReceta">
            <RecetaPrimera />
          </div>
          <button>Siguiente</button>
          
        </section>
        
        
        
       
      </main>
    </>
  );
}

export default Titulo;
