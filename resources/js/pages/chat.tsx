import ChatContainer from '@/components/chat-container';
import { getLaravelTimestamp, getOtherUserFromPrivateChat } from '@/helper';
import useCurrentUser from '@/hooks/use-current-user';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { MessageObject } from '@/types/event';
import { MessageForm } from '@/types/form';
import { Conversations, Message } from '@/types/model';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { ArrowLeft, ImageIcon, SendHorizonal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat',
        href: '/chat',
    },
];

export default function Chat({
    conversation,
    messages,
    unReadMessages,
}: {
    conversation: Conversations;
    messages: Message[][];
    unReadMessages: Message[];
}) {
    const otherUser = getOtherUserFromPrivateChat(conversation);
    const { data, setData, reset, post, processing, errors } = useForm<MessageForm>({
        message: '',
        files: [],
        conversation_id: conversation.id,
    });
    const currentUser = useCurrentUser();
    const getInitials = useInitials();
    const [currentMessages, setCurrentMessages] = useState(messages);
    const markMessageAsSeen = async (AllMessageGroups: Message[][]) => {
        if (document.hidden) {
            return;
        }
        const unSeenMessageIds: number[] = [];
        let latestSenderMessageGroupIndex = 0;
        let latestSenderMessageGroup: Message[] = [];
        AllMessageGroups.forEach((messageGroup, index) => {
            if (messageGroup[0].sender_id !== currentUser.id) {
                latestSenderMessageGroup = messageGroup;
                latestSenderMessageGroupIndex = index;
            }
        });
        latestSenderMessageGroup.forEach((message) => {
            let currentUserNotExist = true;
            message.message_seen.forEach((user) => {
                if (user.id === currentUser.id) currentUserNotExist = false;
            });
            if (currentUserNotExist) unSeenMessageIds.push(message.id);
        });
        if (unSeenMessageIds.length > 0) {
            const bearerToken = localStorage.getItem('bearerToken');
            const res = await fetch('/api/update-message-read-status', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    unread_message_ids: unSeenMessageIds,
                }),
            });
            if (res.status === 200) {
                const resData = await res.json();
                if (resData.status === 'success') {
                    // nothing to do here
                }
            }
        }
    };
    useEffect(() => {
        markMessageAsSeen(messages);
        document.addEventListener('visibilitychange', () =>
            setCurrentMessages((prev) => {
                markMessageAsSeen(prev);
                return prev;
            }),
        );
        return () => {
            document.removeEventListener('visibilitychange', () =>
                setCurrentMessages((prev) => {
                    markMessageAsSeen(prev);
                    return prev;
                }),
            );
        };
    }, []);
    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data.message || data.files?.length) {
            post(route('chat.store'), {
                onSuccess: () => reset(),
                onError: (error) => {
                    console.log(error);
                    setCurrentMessages((preCurrentMessages) => {
                        const lastGroup = preCurrentMessages[preCurrentMessages.length - 1];
                        const prevMessage = lastGroup ? lastGroup[lastGroup.length - 1] : null;
                        const newMessage = {
                            conversation_id: conversation.id,
                            created_at_human: '',
                            created_at_human_24h: '',
                            id: Date.now(),
                            images: [],
                            message_seen: [],
                            message: error.message,
                            sender_id: currentUser.id,
                            created_at: getLaravelTimestamp(),
                            updated_at: getLaravelTimestamp(),
                            files: null,
                            is_read: false,
                            error: true,
                            receiver_id: '',
                        };

                        if (prevMessage && currentUser.id === prevMessage.sender_id) {
                            const updatedLastGroup = [...lastGroup, newMessage];
                            const updatedMessage = [...preCurrentMessages.slice(0, -1), updatedLastGroup];
                            return updatedMessage;
                        } else {
                            const updatedMessage = [...preCurrentMessages, [newMessage]];
                            return updatedMessage;
                        }
                    });
                    reset();
                },
            });
        }
    };
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData('files', Array.from(e.target.files));
        }
    };
    const handleFileRemove = (index: number) => {
        if (!data.files) return;
        const updatedFiles = data.files.filter((_, i) => i !== index);
        setData('files', updatedFiles);
    };

    const handleMessageReceive = (e: MessageObject) => {
        const messageObj: Message = typeof e.message === 'string' ? JSON.parse(e.message) : e.message;

        setCurrentMessages((prevCurrentMessages: Message[][]) => {
            if (
                prevCurrentMessages.length > 0 &&
                ((prevCurrentMessages[prevCurrentMessages.length - 1][0].sender_id === currentUser.id && messageObj.sender_id === currentUser.id) ||
                    (prevCurrentMessages[prevCurrentMessages.length - 1][0].sender_id === otherUser.id && messageObj.sender_id === otherUser.id))
            ) {
                const lastGroup = prevCurrentMessages[prevCurrentMessages.length - 1];
                if (!lastGroup.some((msg) => msg.id === messageObj.id)) {
                    const updatedMessages = [...prevCurrentMessages.slice(0, -1), [...lastGroup, messageObj as Message]];
                    return updatedMessages;
                }
                return prevCurrentMessages;
            } else {
                const updatedPrevCurrentMessages = [...prevCurrentMessages, [messageObj as Message]];
                return updatedPrevCurrentMessages;
            }
        });
        setTimeout(() => {
            setCurrentMessages((preMessages) => {
                markMessageAsSeen(preMessages);
                return preMessages;
            });
        }, 500);
    };
    const handleMessageSeen = (e: any) => {
        const conversation = e.conversation
        const messages: Message[] = e.messages
        const messagesIds = messages.map(message => message.id) 
        const user = e.user
        setCurrentMessages(prevMessage => 
            prevMessage.map(
            messageGroup => messageGroup.map(
                message => 
                    messagesIds.includes(message.id)? 
                    {...message, message_seen: [...message.message_seen, user]}
                    : message 
                )
            )
        )
    };
    useEcho(`conversation.${conversation.id}`, `SendMessage`, handleMessageReceive);
    useEcho(`conversation.${conversation.id}`, `MessageSeen`, handleMessageSeen);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chat" />
            <div>
                <div className="chat-header border-b">
                    <div className="chat-header-left">
                        <div className="back-button-container">
                            <Link href={route('messages')} className="back-button rounded-full hover:bg-gray-100 dark:hover:bg-[#171717]">
                                <ArrowLeft className="h-[30px] w-[30px] text-[#171717] dark:text-white" />
                            </Link>
                        </div>
                        <div className="recipient-dp-header-and-idicator">
                            <div className="recipient-header-dp">
                                {otherUser.image ? (
                                    <img src={`/${otherUser.image}`} alt=""></img>
                                ) : (
                                    <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">
                                        {getInitials(otherUser.name)}
                                    </div>
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
                        <span className="info hover:bg-gray-100 dark:hover:bg-gray-900">
                            <span className="info-icon border-2 border-[#171717] text-[#171717] dark:border-gray-100 dark:text-gray-100">i</span>
                        </span>
                    </div>
                </div>
                <ChatContainer conversation={conversation} currentUser={currentUser} messages={currentMessages} />
                {data.files && data.files.length > 0 ? (
                    <div className="no-scrollbar absolute bottom-0 mb-18 flex w-fit gap-2 overflow-x-scroll bg-gray-100 p-2 dark:bg-black">
                        {data.files.map((file, index) => (
                            <div key={index} className="relative min-w-fit bg-white p-2 dark:bg-gray-900">
                                <button className="absolute top-1 right-1 flex cursor-pointer items-center justify-center rounded-full bg-gray-100 p-1 text-red-600 hover:bg-red-600 hover:text-gray-100">
                                    <X onClick={(e) => handleFileRemove(index)} className="h-[25px] w-[25px]" />
                                </button>
                                <img className="max-md:h-180px h-[250px] w-fit object-contain" src={URL.createObjectURL(file)} />
                            </div>
                        ))}
                    </div>
                ) : null}
                <form className="chat-sendbox absolute bottom-1.5 p-4" onSubmit={sendMessage}>
                    <div className="image-file-container rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                        <label htmlFor="image-file" className="image-file cursor-pointer">
                            <ImageIcon className="h-[30px] w-[30px] text-[#171717] dark:text-gray-100" />
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
                            className="message-input-box scrollbar-hide border-1 border-transparent bg-gray-100 focus:border-gray-100 focus:bg-transparent dark:bg-gray-900"
                            onChange={(e) => setData('message', e.target.value)}
                            value={data.message}
                        ></input>
                    </div>
                    <div className="send-button-container rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                        <button type="submit" className="cursor-pointer">
                            <SendHorizonal className="h-[30px] w-[30px] text-[#171717] dark:text-gray-100" />
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
