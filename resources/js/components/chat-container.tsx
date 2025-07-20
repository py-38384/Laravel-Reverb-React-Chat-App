import { Message, User } from '@/types/model'
import { useEffect, useRef } from 'react';
import { useInitials } from '@/hooks/use-initials';

const ChatContainer = ({user, messages, currentUnreadMessage, setCurrentUnreadMessage}: {user: User, messages: Message[][], currentUnreadMessage: Message[], setCurrentUnreadMessage: React.Dispatch<React.SetStateAction<Message[]>>}) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    },[user, messages])
    const getInitials = useInitials()
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
        makeAsRead(payload)
    },[currentUnreadMessage])
  return (
    <div className="chat-container p-4">
        {messages.map((messageGroup, groupIndex) => (
        <div key={groupIndex} className={`chat ${messageGroup[0].receiver_id === user.id? "chat-right": "chat-left"}`}>
            <div className="dp-container" style={{ 
                display: messageGroup[0].receiver_id === user.id? "none": "block"
             }}>
                {user.image? (
                    <img src={`/${user.image}`} alt="" style={messageGroup[0].receiver_id === user.id ? { width: '30px' } : {}} />
                ) : (
                    <div className='bg-gray-200 w-[45px] h-[45px] rounded-full flex items-center justify-center'>{getInitials(user.name)}</div>
                )}
            </div>
            <div className="message-container">
                {messageGroup.map((message, index) => 
                <div key={message.id}>
                    {message.receiver_id === user.id?(
                        <>
                        <div key={message.id} className="message-box">
                            <span className="message message-right message bg-gray-100 dark:bg-gray-900">
                                {message.message}
                            </span>
                            <span className="recipient-dp"><img src="/assets/onika.jpg" style={{ opacity: 0 }} alt=""/></span>
                        </div>
                        <div className={`text-[10px] bottom-0 left-0 mr-8 text-gray-500 ${(index === (messageGroup.length-1)) && ((messages.length-1) === groupIndex) ? 'block':'hidden'}`}>{message.created_at_human}</div>
                        <div className='absolute w-full text-center text-[10px] bottom-0 left-0'>{message.created_at_human_24h}</div>
                        </>
                    ):(
                        <>
                        <div key={message.id} className="message bg-gray-100 dark:bg-gray-900" >
                            {message.message}
                        </div>
                        <div className={`text-[10px] bottom-0 left-0 text-gray-500 ${(index === (messageGroup.length-1)) && ((messages.length-1) === groupIndex) ? 'block':'hidden'}`}>{message.created_at_human}</div>
                        <div className='absolute w-full text-center text-[10px] bottom-0 left-0'>{message.created_at_human_24h}</div>
                        </>
                    )}
                </div>
                )}
            </div>
        </div>
        ))}
        <div id='bottom-anchor' ref={bottomRef}></div>
    </div>
  )
}

export default ChatContainer;