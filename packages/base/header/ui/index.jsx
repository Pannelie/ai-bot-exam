import "./index.css";
import { Logo } from "@csbot/logo";

export const Header = ({ type }) => {
  const title = type === "small" ? "Nova" : "TechNova AB";
  const titleClass = type === "small" ? "header__title--small" : "header__title--large";

  return (
    <header className={`header header--${type}`}>
      <Logo type={type} />
      <h1 className={`header__title ${titleClass}`}>{title}</h1>
    </header>
  );
};
