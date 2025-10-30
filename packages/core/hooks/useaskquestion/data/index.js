import { useRef } from "react";
import { useState } from "react";
import { chain } from "@csbot/chains";
import { useChatStore } from "@csbot/usechatstore";

export const useAskQuestion = () => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const { messages, addMessage } = useChatStore();

  const welcomeMessage = "Hej! Jag heter Nova och kan svara på allt du undrar över inom TechNova Ab. Hur kan jag hjälpa dig idag?";

  if (messages.length === 0) {
    addMessage({ role: "assistant", content: welcomeMessage });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = inputRef.current.value;
    if (!question.trim()) return;

    console.log("question: ", question);

    setLoading(true);
    addMessage({ role: "user", content: question });
    inputRef.current.value = "";

    const answer = await chain.invoke({ question });
    console.log("answer: ", answer);

    let message = answer?.response || "Ingen respons";
    if (answer?.sources?.length) {
      message += `\n\n Källor: ${answer.sources.join(", ")}`;
    }
    addMessage({ role: "assistant", content: message });
    setLoading(false);
  };

  return { messages, loading, handleSubmit, inputRef };
};
