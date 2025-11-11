// store/useChatStore.js
import { create } from "zustand";

export const useChatStore = create((set) => ({
  loadingMessagedUsers: false,
  conversations: [],
  conversationId: null,
  activeConversation: null,
  messages: [],
  messageText: "",
  isTyping: false,
  otherUserTyping: false,
  showEmojiPicker: false,
  page: 0,

  // generic helpers that accept value OR updater function
  setLoadingMessagedUsers: (v) => set({ loadingMessagedUsers: v }),
  setConversations: (v) =>
    set((s) => ({ conversations: typeof v === "function" ? v(s.conversations) : v })),
  setConversationId: (v) => set({ conversationId: v }),
  setActiveConversation: (v) => set({ activeConversation: v }),
  setMessages: (v) =>
    set((s) => ({ messages: typeof v === "function" ? v(s.messages) : v })),
  setMessageText: (v) =>
    set((s) => ({ messageText: typeof v === "function" ? v(s.messageText) : v })),
  setIsTyping: (v) => set({ isTyping: v }),
  setOtherUserTyping: (v) => set({ otherUserTyping: v }),
  setShowEmojiPicker: (v) =>
    set((s) => ({ showEmojiPicker: typeof v === "function" ? v(s.showEmojiPicker) : v })),
  setPage: (v) => set((s) => ({ page: typeof v === "function" ? v(s.page) : v })),

  // convenience actions
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  prependMessages: (msgs) => set((s) => ({ messages: [...msgs, ...s.messages] })),
  resetChat: () =>
    set({
      conversationId: null,
      activeConversation: null,
      messages: [],
      messageText: "",
      isTyping: false,
      otherUserTyping: false,
      showEmojiPicker: false,
      page: 0,
    }),
}));

export default useChatStore;
