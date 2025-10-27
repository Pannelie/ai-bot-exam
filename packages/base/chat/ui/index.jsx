import "./index.css";
import { useAskQuestion } from "@csbot/useaskquestion";

export const Chat = () => {
  return (
    <section className="chat">
      <section className="chat__messages">
        <p>chattmeddelande</p>
      </section>
      <form className="chat__form" onSubmit={handleSubmit}>
        <input type="text" className="chat__input" ref={inputRef} />
        <button className="chat__button">Skicka</button>
      </form>
    </section>
  );
};
