import "./index.css";
import { Header } from "@csbot/header";
import { Hero } from "@csbot/hero";
import { Footer } from "@csbot/footer";

export const HomePage = () => {
  return (
    <section className="home-page">
      <Header title={"TechNova AB"} type={"large"} image={"logo"} />
      <main>
        <Hero />
      </main>
      <Footer />
    </section>
  );
};
