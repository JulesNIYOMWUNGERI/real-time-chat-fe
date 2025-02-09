import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error: any) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error: any) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData: { text: string, image: any }) => {
        const { selectedUser, messages } = get() as any;
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get() as any;
        if(!selectedUser) return;

        const socket = (useAuthStore.getState() as any).socket;

        // todo: optimize this one later
        socket.on("newMessage", (newMessage: any) => {
            set({
                messages: [...(get() as any).messages, newMessage]
            })
        });
    },

    unSubscribeFromMessages: () => {
        const socket = (useAuthStore.getState() as any).socket;

        socket.off("newMessage");
    },

    // todo: optimize this one later
    setSelectedUser: (selectedUser: any) => set({ selectedUser }),
}));
