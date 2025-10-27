import React, { useRef } from "react";
import { useState } from "react";
import { chain } from "@csbot/chains";

export const useAskQuestion = () => {
  const [messages, setMessages] = useState([]);
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
