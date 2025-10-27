import { Message } from "@csbot/message";
import "./index.css";
import { useAskQuestion } from "@csbot/useaskquestion";

export const Chat = () => {
  const { messages, loading, handleSubmit, inputRef } = useAskQuestion();

  const messageComponents = messages.map((message, index) => <Message role={message.role} text={message.text} key={index} />);

  return (
    <section className="chat">
      <section className="chat__messages">
        {messageComponents}
        {/* {loading && } */}
      </section>
      <form className="chat__form" onSubmit={handleSubmit}>
        <input type="text" className="chat__input" ref={inputRef} />
        <button className="chat__button">Skicka</button>
      </form>
    </section>
  );
};
