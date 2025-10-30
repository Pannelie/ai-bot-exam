import "./index.css";
import logo from "../../../../src/assets/logo.png";
import Nova from "../../../../src/assets/nova.png";

export const Logo = ({ type }) => {
  const image = type === "large" ? logo : Nova;

  return <img className={`logo logo--${type}`} src={image} alt="Logo" />;
};
