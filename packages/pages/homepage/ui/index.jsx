import "./index.css";
import { Header } from "@csbot/header";
import { Footer } from "@csbot/footer";

export const HomePage = () => {
  return (
    <section className="home-page">
      <Header type={"large"} />
      <main>
        <article className="hero">
          <h1 className="hero__title">Hero</h1>
          <p className="hero__text">Hero text blablabla</p>
        </article>
      </main>
      <Footer />
    </section>
  );
};
