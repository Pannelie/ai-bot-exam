import "./index.css";
import { Logo } from "@csbot/logo";
import { Loading } from "@csbot/loading";

export const Message = ({ role, text, children, source, onSourceClick, loading }) => {
  return (
    <>
      <article className={`message message--${role === "user" ? "user" : "assistant"}`}>
        {role === "assistant" && <Logo type={"small"} />}
        <div className={`message__content message__content--${role === "user" ? "user" : "assistant"}`}>
          {loading ? (
            <Loading />
          ) : (
            <>
              {text && <p className="message__text">{text}</p>}
              {children}
            </>
          )}{" "}
          {source && !loading && (
            <button className="message__source-btn" onClick={onSourceClick}>
              <span className="message__source-btn-text">Läs mer här</span>
            </button>
          )}
        </div>
      </article>
    </>
  );
};
