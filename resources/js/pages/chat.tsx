import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ImageIcon, SendHorizonal } from "lucide-react"
import { User, Message } from '@/types/model';
import { useForm } from '@inertiajs/react';
import { useId } from 'react';
import React, { useEffect, useRef } from 'react';
import { MessageForm } from '@/types/form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat',
        href: '/chat',
    },
];

export default function Chat({user, messages}: {user: User, messages: Message[][]}) {
    const { data, setData, reset, post, processing, errors } = useForm<MessageForm>({
        message: '',
        file: null,
        receiver_id: user.id
    })
    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(route('chat.store'), {
            onSuccess: () => reset()
        })
    }
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0){
            setData("file", e.target.files[0])
        }
    }
    const bottomRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
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
                                href={route('dashboard')}
                                className="back-button hover:bg-gray-100 rounded-full dark:hover:bg-[#171717]"
                            >
                                <ArrowLeft
                                    className='w-[30px] h-[30px] text-[#171717] dark:text-white'
                                />
                            </Link>
                        </div>
                        <div className="recipient-dp-header-and-idicator">
                            <div className="recipient-header-dp">
                                <img src="/assets/onika.jpg" alt=""></img>
                            </div>
                            <div className="name-and-idicator">
                                <h4 className="recipient-name text-2xl font-extrabold">{user.name}</h4>
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
                <div className="chat-container p-4" ref={bottomRef}>
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

                </div>
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
