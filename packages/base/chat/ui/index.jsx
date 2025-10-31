import { Message } from "@csbot/message";
import "./index.css";
import { useAskQuestion } from "@csbot/useaskquestion";
import { Form } from "@csbot/form";
import { Header } from "@csbot/header";

export const Chat = ({ onSourceClick }) => {
  const { messages, handleSubmit, inputRef } = useAskQuestion();

  // const messageComponents = messages.map((message, index) => {
  //   if (message.source && onSourceClick) {
  //     return (
  //       <Message
  //         key={message.id || index}
  //         role={message.role}
  //         text={message.content}
  //         loading={message.loading}
  //         source={message.source}
  //         onSourceClick={message.source && onSourceClick ? () => onSourceClick(message.highlight) : undefined}
  //       />
  //     );
  //   }
  //   return <Message key={index} role={message.role} text={message.content} />;
  // });

  const messageComponents = messages.map((message, index) => (
    <Message
      key={message.id || index}
      role={message.role}
      text={message.content}
      loading={message.loading}
      source={message.source}
      onSourceClick={message.source && onSourceClick ? () => onSourceClick(message.highlight) : undefined}
    />
  ));
  return (
    <section className="chat">
      <Header title={"Nova"} type={"small"} />
      <section className="chat__messages">{messageComponents}</section>
      <Form handleSubmit={handleSubmit} inputRef={inputRef} />
    </section>
  );
};
