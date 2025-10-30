import { create } from "zustand";

export const useChatToggle = create((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  //direkta sätt att ändra om jag inte vill toggla
  openChat: () => set({ open: true }),
  closeChat: () => set({ open: false }),
}));
