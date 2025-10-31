import "./index.css";
import { Logo } from "@csbot/logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useChatToggle } from "@csbot/usechattoggle";

export const Header = ({ title, type, image }) => {
  const { toggle } = useChatToggle();

  const titleClass = type === "small" ? "header__title--small" : "header__title--large";

  const headerType = `header--${type}`;
  return (
    <header className={`header ${headerType}`}>
      <Logo type={type} image={image} />
      <h1 className={`header__title ${titleClass}`}>{title}</h1>
      {headerType === "header--small" && (
        <button className="close-btn close-btn--header" onClick={toggle} title="Stäng chattfönster">
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      )}
    </header>
  );
};
