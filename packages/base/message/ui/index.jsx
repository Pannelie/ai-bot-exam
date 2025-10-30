import "./index.css";
import { Logo } from "@csbot/logo";

export const Message = ({ role, text, children, source, onSourceClick }) => {
  return (
    <>
      <article className={`message message--${role === "user" ? "user" : "assistant"}`}>
        {role === "assistant" && <Logo type={"small"} />}
        <p className={`message__content message__content--${role === "user" ? "user" : "assistant"}`}>
          {text || children}
          {source && (
            <button className="message__source-link" onClick={() => onSourceClick(source)}>
              Läs mer här
            </button>
          )}
        </p>
      </article>
    </>
  );
};
