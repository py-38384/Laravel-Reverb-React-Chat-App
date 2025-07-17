import { Message, User } from '@/types/model'
import { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

const ChatContainer = ({user, messages, currentUnreadMessage, setCurrentUnreadMessage}: {user: User, messages: Message[][], currentUnreadMessage: Message[], setCurrentUnreadMessage: React.Dispatch<React.SetStateAction<Message[]>>}) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    },[user, messages])
    const makeAsRead = async(payload: number[]) => {
        const bearerToken = localStorage.getItem("bearerToken")
        const res = await fetch("/api/update-message-read-status",{
            method: "POST",
            headers: {
                'accept': "application/json",
                'Content-Type': "application/json",
                'Authorization': `Bearer ${bearerToken}`,
            },
            body: JSON.stringify({
                user_id: user.id,
                unread_message_ids: payload,
            })
        })
        if(res.status === 200){
            const resData = await res.json()
            if(resData.status === "success"){
                setCurrentUnreadMessage([]);
            }
        }
    }
    useEffect(() => {
        if (!currentUnreadMessage.length) return;
        const payload: number[] = []
        currentUnreadMessage.map(message => {
            payload.push(message.id)
        })
        console.log(payload)
        makeAsRead(payload)
    },[])
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