import imagen1 from "../images/imagen1.jpg";
import imagen2 from "../images/imagen2.jpg";
import imagen3 from "../images/imagen3.jpg";

const getImage = (image) => {
  if (image === "imagen1") return imagen1;
  if (image === "imagen2") return imagen2;
  if (image === "imagen3") return imagen3;
};

export default getImage;
