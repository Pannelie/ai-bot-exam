import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  updateMessage: (id, updatedFields) => {
    set((state) => ({
      messages: state.messages.map((msg) => (msg.id === id ? { ...msg, ...updatedFields } : msg)),
    }));
  },
  clearMessages: () => set({ messages: [] }),
}));
