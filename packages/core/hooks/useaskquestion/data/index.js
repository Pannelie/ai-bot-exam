import { useRef } from "react";
import { useState } from "react";
import { chain } from "@csbot/chains";

export const useAskQuestion = () => {
  const welcomeMessage = "Hej! Jag heter Nora och kan svara på allt du undrar över inom TechNova Ab. Hur kan jag hjälpa dig idag?";
  const [messages, setMessages] = useState([{ role: "assistant", content: welcomeMessage }]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = inputRef.current.value;
    if (!question.trim()) return;

    console.log("question: ", question);

    setLoading(true);
    addMessage("user", question);
    inputRef.current.value = "";

    const answer = await chain.invoke({ question });
    console.log("answer: ", answer);

    addMessage("assistant", answer?.response || "Ingen respons");
    setLoading(false);
  };

  return { messages, loading, handleSubmit, inputRef };
};
