import "./index.css";
import logo from "../../../../src/assets/logo.png";
import Nova from "../../../../src/assets/nova.png";

export const Logo = ({ type, image }) => {
  const selectedImage = image === "logo" ? logo : Nova;

  return <img className={`logo logo--${type}`} src={selectedImage} alt="Logo" />;
};
