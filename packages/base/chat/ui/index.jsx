import { Message } from "@csbot/message";
import "./index.css";
import { useAskQuestion } from "@csbot/useaskquestion";
import { Form } from "@csbot/form";
import { Loading } from "@csbot/loading";

export const Chat = () => {
  const { messages, loading, handleSubmit, inputRef } = useAskQuestion();

  const messageComponents = messages.map((message, index) => <Message role={message.role} text={message.content} key={index} />);

  if (loading) {
    messageComponents.push(
      <Message key="loading" role="assistant">
        <Loading />
      </Message>
    );
  }

  return (
    <section className="chat">
      <section className="chat__messages">{messageComponents}</section>
      <Form handleSubmit={handleSubmit} inputRef={inputRef} />
    </section>
  );
};
