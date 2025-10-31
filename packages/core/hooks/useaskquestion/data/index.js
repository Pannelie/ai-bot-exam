import { useRef } from "react";
import { useState } from "react";
import { chain } from "@csbot/chains";
import { useChatStore } from "@csbot/usechatstore";

export const useAskQuestion = () => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const { messages, addMessage, updateMessage } = useChatStore();

  const welcomeMessage = "Hej! Jag heter Nova och kan svara på allt du undrar över inom TechNova Ab. Hur kan jag hjälpa dig idag?";

  if (messages.length === 0) {
    addMessage({ role: "assistant", content: welcomeMessage, loading: false });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = inputRef.current.value;
    if (!question.trim()) return;

    console.log("question: ", question);

    setLoading(true);
    addMessage({ role: "user", content: question });
    const loadingMessageId = addMessage({ role: "assistant", content: "", loading: true });

    inputRef.current.value = "";

    const answer = await chain.invoke({
      question,
      instructions: "Välj den mest relevanta källan från listan och returnera den som mainSource tillsammans med svaret.",
    });
    console.log("answer: ", answer);

    let assistantMessage = answer?.response || "Ingen respons";
    let mainSource = answer?.mainSource || null;

    if (!mainSource && answer?.sources?.length) {
      mainSource = answer.sources.reduce((best, source) => {
        const matchCount = question
          .toLowerCase()
          .split(" ")
          .filter((word) => source.title.toLowerCase().includes(word) || source.content?.toLowerCase().includes(word)).length;
        if (!best || matchCount > best.matchCount) {
          return { ...source, matchCount };
        }
        return best;
      }, null);
    }

    updateMessage(loadingMessageId, {
      content: assistantMessage,
      source: mainSource,
      highlight: mainSource?.title,
      loading: false,
    });

    setLoading(false);
  };

  return { messages, loading, handleSubmit, inputRef };
};
