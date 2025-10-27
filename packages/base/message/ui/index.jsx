import "./index.css";

export const Message = ({ role, text }) => {
  return (
    <article className={`message message--${role === "user" ? "user" : "assistant"}`}>
      <span className="message__sender">{role}</span>
      <p className="message__content">{text}</p>
    </article>
  );
};
