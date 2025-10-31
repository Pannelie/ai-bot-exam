import { Message } from "@csbot/message";
import "./index.css";
import { useAskQuestion } from "@csbot/useaskquestion";
import { Form } from "@csbot/form";
import { Loading } from "@csbot/loading";
import { Header } from "@csbot/header";

export const Chat = ({ onSourceClick }) => {
  const { messages, loading, handleSubmit, inputRef } = useAskQuestion();

  const messageComponents = messages.map((message, index) => {
    if (message.source && onSourceClick) {
      return (
        <Message
          key={index}
          role={message.role}
          text={message.content}
          source={message.source}
          onSourceClick={() => onSourceClick(message.highlight)}
        />
      );
    }
    return <Message key={index} role={message.role} text={message.content} />;
  });

  if (loading) {
    messageComponents.push(
      <Message key="loading" role="assistant">
        <Loading />
      </Message>
    );
  }
  return (
    <section className="chat">
      <Header title={"Nova"} type={"small"} />
      <section className="chat__messages">{messageComponents}</section>
      <Form handleSubmit={handleSubmit} inputRef={inputRef} />
    </section>
  );
};
