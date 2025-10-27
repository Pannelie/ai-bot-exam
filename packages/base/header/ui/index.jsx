import "./index.css";
import { Logo } from "@csbot/logo";

export const Header = () => {
  return (
    <header className="header">
      <Logo />
      <h1 className="header__title">TechNova AB</h1>
    </header>
  );
};
