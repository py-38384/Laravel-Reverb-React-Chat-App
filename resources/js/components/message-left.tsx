import { getOtherUserFromPrivateChat } from "@/helper";
import { useInitials } from "@/hooks/use-initials";
import { Conversations, Image, Message } from "@/types/model";
import { useEffect } from "react";

const MessageLeft = ({
    
    conversation, 
    message, 
    messages,
    messageGroup,
    groupIndex,
    index
    
    } : {
        
    conversation: Conversations, 
    message: Message, 
    messages: Message[][],
    messageGroup: Message[],
    groupIndex: number,
    index: number

    }) => {
    return (
        <>
            <div
                key={message.id}
                className={`message message-left flex flex-col justify-center ${message.error ? 'bg-red-500' : 'bg-gray-100 dark:bg-gray-900'}`}
            >
                {message.images
                    ? message.images.map((image: Image) => (
                          <span key={image.id} className="">
                              <div className="my-[3px] flex flex-col">
                                  <img key={image.id} src={`/message/image/${image.id}?preview=true`} />
                              </div>
                          </span>
                      ))
                    : null}
                {message.message}
            </div>
            <div
                className={`bottom-0 left-0 text-[10px] text-gray-500 ${index === messageGroup.length - 1 && messages.length - 1 === groupIndex ? 'block' : 'hidden'}`}
            >
                {message.created_at_human}
            </div>
            <div className="absolute bottom-0 left-0 w-full text-center text-[10px]">{message.created_at_human_24h}</div>
        </>
    );
};

export default MessageLeft;
