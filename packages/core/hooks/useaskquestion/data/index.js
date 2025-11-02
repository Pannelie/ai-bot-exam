import { useRef, useState } from "react";
import { chain } from "@csbot/chains";
import { useChatStore } from "@csbot/usechatstore";

export const useAskQuestion = () => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const { messages, addMessage, updateAssistantMessage } = useChatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = inputRef.current.value;
    if (!question.trim()) return;

    console.log("question: ", question);

    setLoading(true);
    addMessage({ role: "user", content: question });
    addMessage({ role: "assistant", content: "", loading: true, source: null });
    inputRef.current.value = "";

    try {
      const answer = await chain.invoke({ question });
      console.log("Raw answer:", answer);

      const assistantMessage = typeof answer.response === "string" ? answer.response : answer.response?.response ?? "Ingen respons";
      const mainSource = typeof answer.response === "object" ? answer.response.mainSource ?? null : null;

      // Bygg meddelandet
      const messageUpdate = {
        content: assistantMessage,
        loading: false,
        source: mainSource,
      };

      updateAssistantMessage(messageUpdate);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      updateAssistantMessage({
        content: "Ett fel uppstod när svaret skulle hämtas.",
        loading: false,
        source: null,
      });
    } finally {
      setLoading(false);
    }
  };
  return { messages, loading, handleSubmit, inputRef };
};
