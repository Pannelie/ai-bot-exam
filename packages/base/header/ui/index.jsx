import "./index.css";
import { Logo } from "@csbot/logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export const Header = ({ type }) => {
  const title = type === "small" ? "Nova" : "TechNova AB";
  const titleClass = type === "small" ? "header__title--small" : "header__title--large";

  const headerType = `header--${type}`;
  return (
    <header className={`header ${headerType}`}>
      <Logo type={type} />
      <h1 className={`header__title ${titleClass}`}>{title}</h1>
      {headerType === "header--small" && (
        <button className="close-btn close-btn--header">
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      )}
    </header>
  );
};
