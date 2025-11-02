import { create } from "zustand";

const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hej! Jag heter Nova och kan svara på allt du undrar över inom TechNova Ab. Hur kan jag hjälpa dig idag?",
  loading: false,
};

export const useChatStore = create((set) => ({
  messages: [welcomeMessage],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateAssistantMessage: (updatedData) =>
    set((state) => {
      const messages = [...state.messages];
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "assistant" && messages[i].loading) {
          messages[i] = { ...messages[i], ...updatedData };
          break;
        }
      }
      return { messages };
    }),
  clearMessages: () => set({ messages: [welcomeMessage] }),
}));
