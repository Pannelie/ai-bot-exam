import "./index.css";
import { Header } from "@csbot/header";
import { Footer } from "@csbot/footer";
import Vaccum from "../../../../src/assets/vacuum.webp";

export const HomePage = () => {
  return (
    <section className="home-page">
      <Header title={"TechNova AB"} type={"large"} image={"logo"} />
      <main>
        <article className="hero">
          <img src={Vaccum} alt="dammsugare" className="hero__img"></img>
          <h1 className="hero__title">Dammsugare</h1>
          <p className="hero__text">Köp din dammsugare hos TechNova AB</p>
        </article>
      </main>
      <Footer />
    </section>
  );
};
