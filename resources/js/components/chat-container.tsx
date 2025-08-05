import { useInitials } from '@/hooks/use-initials';
import { Image, Message, User } from '@/types/model';
import { useEffect, useRef } from 'react';

const ChatContainer = ({
    user,
    messages,
    currentUnreadMessage,
    setCurrentUnreadMessage,
}: {
    user: User;
    messages: Message[][];
    currentUnreadMessage: Message[];
    setCurrentUnreadMessage: React.Dispatch<React.SetStateAction<Message[]>>;
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
    },[user, messages])
    const getInitials = useInitials();
    const makeAsRead = async (payload: number[]) => {
        // const bearerToken = localStorage.getItem('bearerToken');
        // const res = await fetch('/api/update-message-read-status', {
        //     method: 'POST',
        //     headers: {
        //         accept: 'application/json',
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${bearerToken}`,
        //     },
        //     body: JSON.stringify({
        //         user_id: user.id,
        //         unread_message_ids: payload,
        //     }),
        // });
        // if (res.status === 200) {
        //     const resData = await res.json();
        //     if (resData.status === 'success') {
        //         setCurrentUnreadMessage([]);
        //     }
        // }
    };
    useEffect(() => {
        if (!currentUnreadMessage.length) return;
        const payload: number[] = [];
        currentUnreadMessage.map((message) => {
            payload.push(message.id);
        });
        makeAsRead(payload);
    }, [currentUnreadMessage]);
    return (
        <div className="chat-container p-4" ref={containerRef}>
            {messages.map((messageGroup, groupIndex) => (
                <div key={groupIndex} className={`chat ${messageGroup[0].sender_id === user.id ? 'chat-left' : 'chat-right'}`}>
                    <div
                        className="dp-container"
                        style={{
                            display: messageGroup[0].sender_id === user.id ? 'block' : 'none',
                        }}
                    >
                        {user.image ? (
                            <img src={`/${user.image}`} alt="" style={messageGroup[0].sender_id === user.id ? {} : {width: '30px'}} />
                        ) : (
                            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">
                                {getInitials(user.name)}
                            </div>
                        )}
                    </div>
                    <div className="message-container">
                        {messageGroup.map((message, index) => (
                            <div key={message.id} className='message-group'>
                                {message.sender_id === user.id ? (
                                    <>
                                         <div
                                            key={message.id}
                                            className={`message message-left flex flex-col justify-center ${message.error?'bg-red-500':'bg-gray-100 dark:bg-gray-900'}`}
                                        >
                                            {message.images
                                                ? message.images.map((image: Image) => (
                                                        <span key={image.id} className="">
                                                            <div className="flex flex-col my-[3px]">
                                                                <img key={image.id} src={`/message/image/${image.id}?preview=true`} />
                                                            </div>
                                                        </span>
                                                    ))
                                                : null
                                            }
                                            {message.message}
                                        </div>
                                        <div
                                            className={`bottom-0 left-0 text-[10px] text-gray-500 ${index === messageGroup.length - 1 && messages.length - 1 === groupIndex ? 'block' : 'hidden'}`}
                                        >
                                            {message.created_at_human}
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full text-center text-[10px]">{message.created_at_human_24h}</div>
                                    </>
                                ) : (
                                    <>
                                        <div key={message.id} className="message-box">
                                            <span
                                                className={`message message-right message flex flex-col items-end ${message.error?'bg-red-500':'bg-gray-800 dark:bg-gray-100'} text-white dark:text-gray-900 ${message.images ? 'gap-1.5' : ''}`}
                                            >
                                                {message.images
                                                    ? message.images.map((image: Image) => (
                                                          <img key={image.id} src={`/message/image/${image.id}?preview=true`} />
                                                      ))
                                                    : null
                                                }
                                                {message.message}
                                            </span>
                                            <span className="recipient-dp">
                                                <img src="/assets/onika.jpg" style={{ opacity: 0 }} alt="" />
                                            </span>
                                        </div>
                                        <div
                                            className={`bottom-0 left-0 mr-8 text-[10px] text-gray-500 ${index === messageGroup.length - 1 && messages.length - 1 === groupIndex ? 'block' : 'hidden'}`}
                                        >
                                            {message.created_at_human}
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full text-center text-[10px]">{message.created_at_human_24h}</div>
                                    </>
                                )}
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
