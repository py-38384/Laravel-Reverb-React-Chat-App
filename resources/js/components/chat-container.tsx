import { Message, User } from '@/types/model'
import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

const ChatContainer = ({user, messages, currentUnreadMessage}: {user: User, messages: Message[][], currentUnreadMessage: Message[]}) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    },[user, messages])
    const makeAsRead = (payload: number[]) => {
        
    }
    useEffect(() => {
        if (!currentUnreadMessage.length) return;
        const payload: number[] = []
        currentUnreadMessage.map(message => {
            payload.push(message.id)
        })
        makeAsRead(payload)
    })
  return (
    <div className="chat-container p-4">
        {messages.map((messageGroup, index) => (
        <div key={index} className={`chat ${messageGroup[0].receiver_id === user.id? "chat-right": "chat-left"}`}>
            <div className="dp-container">
                <img src="/assets/onika.jpg" alt="" style={messageGroup[0].receiver_id === user.id ? { width: '30px' } : {}} />
            </div>
            <div className="message-container">
                {messageGroup.map(message => (
                <div key={message.id} className="message bg-gray-100 dark:bg-gray-900" >
                    {message.message}
                </div>
                ))}
            </div>
        </div>
        ))}
        <div id='bottom-anchor' ref={bottomRef}></div>
    </div>
  )
}

export default ChatContainer;