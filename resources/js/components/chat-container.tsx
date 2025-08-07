import { getOtherUserFromPrivateChat } from '@/helper';
import { useInitials } from '@/hooks/use-initials';
import { Conversations, Image, Message, User } from '@/types/model';
import { useEffect, useRef } from 'react';
import MessageRight from './message-right';
import MessageLeft from './message-left';

const ChatContainer = ({
    conversation,
    currentUser,
    messages,
}: {
    conversation: Conversations
    currentUser: User;
    messages: Message[][];
}) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handleLoad = () => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

        window.addEventListener('load', handleLoad);

        return () => window.removeEventListener('load', handleLoad);
    },[])
    useEffect(() => {
        const timeout = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        },1000)
        return () => clearTimeout(timeout)
    },[messages])
    const getInitials = useInitials();
    const isPrivate = conversation.type === 'private';
    const otherUser = isPrivate ? getOtherUserFromPrivateChat(conversation) : null;
    return (
        <div className="chat-container p-4" ref={containerRef}>
            {messages.map((messageGroup, groupIndex) => (
                <div key={groupIndex} className={`chat ${messageGroup[0].sender_id === currentUser.id ? 'chat-right' : 'chat-left'}`}>
                    <div
                        className="dp-container"
                        style={{
                            display: messageGroup[0].sender_id === currentUser.id ? 'none' : 'block',
                        }}
                    >
                        {conversation.type === 'private'?(otherUser?.image ? (
                                <img src={`/${otherUser.image}`} alt="" style={messageGroup[0].sender_id === otherUser.id ? {} : {width: '30px'}} />
                            ) : (
                                <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">
                                    {getInitials(otherUser?.name? otherUser?.name: "Group")}
                                </div>
                            )
                        ): (
                            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">
                                Group
                            </div>
                        )}
                    </div>
                    <div className="message-container">
                        {messageGroup.map((message, index) => (
                            <div key={message.id} className='message-group'>
                                {message.sender_id === currentUser.id ? 
                                    <MessageRight 
                                        conversation={conversation} 
                                        message={message} 
                                        messages={messages} 
                                        messageGroup={messageGroup} 
                                        groupIndex={groupIndex} 
                                        index={index} 
                                    /> : 
                                    <MessageLeft
                                        conversation={conversation} 
                                        message={message} 
                                        messages={messages} 
                                        messageGroup={messageGroup} 
                                        groupIndex={groupIndex} 
                                        index={index} 
                                    />
                                }
                            </div>
                        ))}
                    </div>
                </div>
            ))}
             <div id='bottom-anchor' ref={bottomRef}></div>
        </div>
    );
};

export default ChatContainer;