import "./index.css";
import Vaccum from "../../../../src/assets/vacuum.webp";

export const Hero = () => {
  return (
    <article className="hero">
      <img src={Vaccum} alt="dammsugare" className="hero__img"></img>
      <h1 className="hero__title">Dammsugare</h1>
      <p className="hero__text">Köp din dammsugare hos TechNova AB</p>
      <p className="hero__text--quote">”Smakar bättre än någon modell från Electrolux.”</p>
      <p className="hero__text--quote">”AI-driven aptitväckare: vår dammsugare känner av ditt fikasug.”</p>
    </article>
  );
};
