import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ImageIcon, SendHorizonal, X } from "lucide-react"
import { User, Message, Conversations } from '@/types/model';
import { MessageObject } from '@/types/event';
import { useForm } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import React, { useEffect, useState } from 'react';
import { MessageForm } from '@/types/form';
import ChatContainer from '@/components/chat-container';
import useCurrentUser from '@/hooks/use-current-user';
import { useInitials } from '@/hooks/use-initials';
import { getOtherUserFromPrivateChat } from '@/helper';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat',
        href: '/chat',
    },
];

export default function Chat({conversation, messages, unReadMessages}: {conversation: Conversations, messages: Message[][], unReadMessages: Message[]}) {
    const otherUser = getOtherUserFromPrivateChat(conversation)
    const { data, setData, reset, post, processing, errors } = useForm<MessageForm>({
        message: '',
        files: [],
        conversation_id: conversation.id
    })
    const currentUser = useCurrentUser()
    const getInitials = useInitials()
    const [currentMessages, setCurrentMessages] = useState(messages)
    useEffect(() => {
        setCurrentMessages(messages)
    },[messages])
    const [currentUnreadMessage, setCurrentUnreadMessage] = useState(unReadMessages);
    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route('chat.store'), {
            onSuccess: () => reset()
        })
    }
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0){
            setData("files", Array.from(e.target.files))
        }
    }
    const handleFileRemove = (index: number) => {
        if (!data.files) return;
        const updatedFiles = data.files.filter((_, i) => i !== index);
        setData('files', updatedFiles);
    }

    const handleMessageReceive = (e: MessageObject) => {
        const messageObj: Message = typeof e.message === "string" ? JSON.parse(e.message) : e.message;

        setCurrentMessages((prevCurrentMessages: Message[][]) => {
            if (prevCurrentMessages.length > 0 &&
                (
                    (prevCurrentMessages[prevCurrentMessages.length - 1][0].sender_id === currentUser.id && messageObj.sender_id === currentUser.id) ||
                    (prevCurrentMessages[prevCurrentMessages.length - 1][0].sender_id === otherUser.id && messageObj.sender_id === otherUser.id)
                )
            ) {
                const lastGroup = prevCurrentMessages[prevCurrentMessages.length - 1];
                // Check for duplicate by message id (or use another unique property)
                if (!lastGroup.some(msg => msg.id === messageObj.id)) {
                    return [
                        ...prevCurrentMessages.slice(0, -1),
                        [...lastGroup, messageObj as Message]
                    ];
                }
                return prevCurrentMessages;
            } else {
                return [
                    ...prevCurrentMessages,
                    [messageObj as Message]
                ];
            }
        });
        setCurrentUnreadMessage(prev => [...prev, messageObj])
    }
    useEcho(
        `conversation.${conversation.id}`,
        `SendMessage`,
        handleMessageReceive,
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <div>
                <div
                    className="chat-header border-b"
                >
                    <div className="chat-header-left">
                        <div className="back-button-container">
                            <Link
                                href={route('messages')}
                                className="back-button hover:bg-gray-100 rounded-full dark:hover:bg-[#171717]"
                            >
                                <ArrowLeft
                                    className='w-[30px] h-[30px] text-[#171717] dark:text-white'
                                />
                            </Link>
                        </div>
                        <div className="recipient-dp-header-and-idicator">
                            <div className="recipient-header-dp">
                                {otherUser.image? (
                                    <img src={`/${otherUser.image}`} alt=""></img>
                                ) : (
                                    <div className='bg-gray-200 w-[45px] h-[45px] rounded-full flex items-center justify-center'>{getInitials(otherUser.name)}</div>
                                )}
                            </div>
                            <div className="name-and-idicator">
                                <h4 className="recipient-name text-2xl font-extrabold">{otherUser.name}</h4>
                                <div className="idicator">
                                    <span
                                        className="idicator-icon"
                                        style={{
                                            backgroundColor: 'lime',
                                        }}
                                    ></span>
                                    Online
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="info-container">
                        <span
                            className="info hover:bg-gray-100 dark:hover:bg-gray-900"
                        >
                            <span className="info-icon text-[#171717] dark:text-gray-100 border-2 border-[#171717] dark:border-gray-100">i</span>
                        </span>
                    </div>
                </div>
                <ChatContainer user={otherUser} messages={currentMessages} currentUnreadMessage={currentUnreadMessage} setCurrentUnreadMessage={setCurrentUnreadMessage}/>
                {data.files && data.files.length > 0 ? (
                <div className='bg-gray-100 dark:bg-black mb-18 flex p-2 absolute bottom-0 gap-2 overflow-x-scroll w-fit no-scrollbar'>
                    {data.files.map((file, index) => (
                    <div key={index} className='p-2 bg-white dark:bg-gray-900 relative min-w-fit'>
                        <button className='p-1 absolute text-red-600 rounded-full bg-gray-100 flex items-center justify-center right-1 top-1 cursor-pointer hover:bg-red-600 hover:text-gray-100'><X onClick={(e) => handleFileRemove(index)} className='w-[25px] h-[25px]'/></button>
                        <img className='h-[250px] max-md:h-180px w-fit object-contain' src={URL.createObjectURL(file)} />
                    </div>
                    ))}
                </div>
                ): null}
                <form className="chat-sendbox p-4 absolute bottom-1.5" onSubmit={sendMessage}>
                    <div className="image-file-container hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
                        <label
                            htmlFor="image-file"
                            className="image-file cursor-pointer"
                        >
                            <ImageIcon className='w-[30px] h-[30px] text-[#171717] dark:text-gray-100'/>
                        </label>
                        <input 
                            style={{ display: 'none' }} 
                            id="image-file" 
                            type="file"
                            onChange={handleFileUpload}
                            readOnly={processing}
                            accept="image/*"
                            multiple
                        ></input>
                    </div>
                    <div className="message-box-container">
                        <input
                            name="message"
                            placeholder="Write your message..."
                            id=""
                            className="message-input-box bg-gray-100 focus:bg-transparent border-1 focus:border-gray-100 border-transparent scrollbar-hide dark:bg-gray-900" 
                            onChange={(e) => setData('message', e.target.value)}
                            value={data.message}
                        ></input>
                    </div>
                    <div className="send-button-container hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
                        <button type='submit' className='cursor-pointer'>
                            <SendHorizonal className='w-[30px] h-[30px] text-[#171717] dark:text-gray-100'/>
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
