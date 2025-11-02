import "./index.css";
import { Logo } from "@csbot/logo";
import { Loading } from "@csbot/loading";

export const Message = ({ role, text, children, source, onSourceClick, loading }) => {
  return (
    <>
      <article className={`message message--${role === "user" ? "user" : "assistant"}`}>
        {role === "assistant" && <Logo type={"small"} />}
        <p className={`message__content message__content--${role === "user" ? "user" : "assistant"}`}>
          {loading ? <Loading /> : text || children}
          {source && !loading && (
            <button className="message__source-link" onClick={onSourceClick}>
              Läs mer här
            </button>
          )}
        </p>
      </article>
    </>
  );
};
