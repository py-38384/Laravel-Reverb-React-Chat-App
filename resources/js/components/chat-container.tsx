import { getOtherUserFromPrivateChat, isScrollable } from '@/helper';
import { useInitials } from '@/hooks/use-initials';
import { TypingState } from '@/types/global';
import { Conversations, Message, User } from '@/types/model';
import React, { useEffect, useRef, useState } from 'react';
import { SpinnerCircular } from 'spinners-react';
import MessageLeft from './message-left';
import MessageRight from './message-right';

const ChatContainer = ({
    conversation,
    currentUser,
    messages,
    typing,
    setMessages,
    fetchOlderMessages,
    setScrollToBottom,
}: {
    conversation: Conversations;
    currentUser: User;
    messages: Message[][];
    typing: TypingState;
    setMessages: React.Dispatch<React.SetStateAction<Message[][]>>;
    fetchOlderMessages: () => void;
    setScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(true);
    const [messageLoading, setMessageLoading] = useState(false);
    const oldScrollHeightRef = useRef(0);
    const [allSendingMessageGroup, setAllSendingMessageGroup] = useState(
        messages.filter((messageGroup) => messageGroup[0].sender_id == currentUser.id),
    );
    const [lastMessageSeenId, setLastMessageSeenId] = useState(-1);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
            setScrollToBottom((prev) => {
                if (prev) {
                    bottomRef.current?.scrollIntoView();
                } else {
                }
                return true;
            });
        }, 500);
        const container = containerRef.current;
        if (container) {
            const newScrollHeight = container.scrollHeight;
            const diff = newScrollHeight - oldScrollHeightRef.current;
            if (diff > 0) {
                container.scrollTop = container.scrollTop + diff;
            }
        }
        setAllSendingMessageGroup(messages.filter((messageGroup) => messageGroup[0].sender_id == currentUser.id));
        return () => clearTimeout(timeout);
    }, [messages]);
    const getInitials = useInitials();
    const isPrivate = conversation.type === 'private';
    const typingTextRef = useRef<HTMLDivElement | null>(null) 
    const otherUser = isPrivate ? getOtherUserFromPrivateChat(conversation) : null;
    useEffect(() => {
        setLastMessageSeenId(() =>
            otherUser
                ? messages
                      .flat()
                      .filter((message) => message.message_seen.some((user) => user.id === otherUser.id))
                      .sort((a, b) => b.id - a.id)[0]?.id
                : -1,
        );
        let text_length = typing? typing.text_length: 0
        let dotHTML = ''
        for (let index = 0; index < text_length; index++) {
            dotHTML+='. '
        }
        const typingTextElement = typingTextRef?.current
        typingTextElement && (typingTextElement.innerHTML = dotHTML)
        bottomRef.current?.scrollIntoView();
    }, [typing]);
    let lastCall = 0;
    useEffect(() => {
        const el = containerRef.current;
        let debouncer: ReturnType<typeof setTimeout>;
        const handleMessageContainerScroll = (e: Event) => {
            const target = e.target as HTMLDivElement;
            
            if (target.scrollTop < 100) {
                const now = Date.now();
                
                if (now - lastCall > 100) {
                    const container = containerRef.current;
                    if (container) {
                        oldScrollHeightRef.current = container.scrollHeight;
                    }
                    setMessageLoading(true);
                    fetchOlderMessages();
                    setMessageLoading(false);

                    lastCall = now;

                    if (debouncer) clearTimeout(debouncer);
                    debouncer = setTimeout(() => {
                        lastCall = 0;
                    }, 1000);
                }
            }
        };
        if (el) {
            el.addEventListener('scroll', handleMessageContainerScroll);
        }
        return () => {
            el?.removeEventListener('scroll', handleMessageContainerScroll);
        };
    }, []);
    useEffect(() => {
        const container = containerRef.current;
        if(!isScrollable(container)){
            fetchOlderMessages();
        }
    },[messages])
    return (
        <div className="relative">
            {messageLoading && (
                <div className="absolute top-0 z-10 flex h-[100px] w-full items-center justify-center bg-transparent">
                    <SpinnerCircular color="black z-10" secondaryColor="#E5E7EB" />
                </div>
            )}
            {loading && (
                <div className="absolute z-10 flex h-full w-full items-center justify-center bg-white">
                    <SpinnerCircular color="black z-10" secondaryColor="#E5E7EB" />
                </div>
            )}
            <div className="chat-container p-4" ref={containerRef}>
                {messages.map((messageGroup, groupIndex) => (
                    <div key={groupIndex} className={`chat ${messageGroup[0].sender_id === currentUser.id ? 'chat-right' : 'chat-left'}`}>
                        <div
                            className="dp-container"
                            style={{
                                display: messageGroup[0].sender_id === currentUser.id ? 'none' : 'block',
                            }}
                        >
                            {conversation.type === 'private' ? (
                                otherUser?.image ? (
                                    <img
                                        src={`/${otherUser.image}`}
                                        alt=""
                                        style={messageGroup[0].sender_id === otherUser.id ? {} : { width: '30px' }}
                                    />
                                ) : (
                                    <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">
                                        {getInitials(otherUser?.name ? otherUser?.name : 'Group')}
                                    </div>
                                )
                            ) : (
                                <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">Group</div>
                            )}
                        </div>
                        <div className="message-container">
                            {messageGroup.map((message, index) => (
                                <div key={message.id} className="message-group">
                                    {message.sender_id === currentUser.id ? (
                                        <MessageRight
                                            conversation={conversation}
                                            message={message}
                                            messages={messages}
                                            messageGroup={messageGroup}
                                            groupIndex={groupIndex}
                                            index={index}
                                            allSendingMessageGroup={allSendingMessageGroup}
                                            lastMessageSeenId={lastMessageSeenId}
                                        />
                                    ) : (
                                        <MessageLeft
                                            conversation={conversation}
                                            message={message}
                                            messages={messages}
                                            messageGroup={messageGroup}
                                            groupIndex={groupIndex}
                                            index={index}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {typing && (
                <div className="chat chat-left">
                    <div className="dp-container">
                        {typing.user.image ? (
                            <img src={`/${typing.user.image}`} alt="" />
                        ) : (
                            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">
                                {getInitials(typing.user.name)}
                            </div>
                        )}
                    </div>
                    <div className="message-container">
                        <div className="message-group">
                            <div className="message message-left flex flex-col justify-center bg-gray-200 dark:bg-gray-900" ref={typingTextRef}>typing</div>
                            <div className="absolute bottom-0 left-0 w-full text-center text-[10px]"></div>
                        </div>
                    </div>
                </div>
                )}

                <div id="bottom-anchor" ref={bottomRef}></div>
            </div>
        </div>
    );
};

export default ChatContainer;
