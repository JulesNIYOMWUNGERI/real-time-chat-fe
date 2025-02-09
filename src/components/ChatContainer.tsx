import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";


const ChatContainer = () => {
  const { 
    messages, 
    getMessages, 
    isMessagesLoading, 
    selectedUser, 
    subscribeToMessages,
    unSubscribeFromMessages
  } = useChatStore() as {
     messages: any, 
     getMessages: (id: string) => void, 
     isMessagesLoading: boolean, 
     selectedUser: any,
     subscribeToMessages: () => void,
     unSubscribeFromMessages: () => void,
  };
  const { authUser } = useAuthStore() as { authUser: any };
  const messageEndRef = useRef(null);
  
  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unSubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unSubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      (messageEndRef.current as any).scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if(isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  console.log(messages, '================================')
  console.log(authUser, '============00000000000====================')
  console.log(selectedUser, '============selectedUser====================')

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: any) => (
          <div
            key={message?._id} 
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img 
                  src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className={`chat-bubble flex flex-col ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "bg-base-200" }`}>
              {message.image && (
                <img 
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p className={`${message.senderId === authUser._id ? "text-primary-content" : "text-base-content"}`}>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer