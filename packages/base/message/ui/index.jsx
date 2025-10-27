export const Message = ({ text, role }) => {
  return (
    <article className={`message message--${role === "user" ? "user" : "assistant"}`}>
      <span className="message__sender">{role}</span>
      <p className="message__content">{text}</p>
    </article>
  );
};
