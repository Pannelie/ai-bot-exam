import "./index.css";
import { Logo } from "@csbot/logo";

export const Message = ({ role, text, children }) => {
  return (
    <>
      <article className={`message message--${role === "user" ? "user" : "assistant"}`}>
        {/* <span className="message__sender">{role === "user" ? "user" : "Nova"}</span> */}
        {role === "assistant" && <Logo type={"small"} />}
        <p className={`message__content message__content--${role === "user" ? "user" : "assistant"}`}>{text || children}</p>
      </article>
    </>
  );
};

// {`message message--${role === "user" ? "user" : "assistant"}`}
