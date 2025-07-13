import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ImageIcon, SendHorizonal } from "lucide-react"
import { User } from '@/types/model';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { MessageForm } from '@/types/form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chat',
        href: '/chat',
    },
];

export default function Chat({user}: {user: User}) {
    const { data, setData, reset, post, processing, errors } = useForm<MessageForm>({
        message: '',
        file: null,
        receiver_id: user.id
    })
    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(data)
        post(route('chat.store'), {
            onSuccess: () => reset()
        })
    }
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0){
            setData("file", e.target.files[0])
        }
    }
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
                <div className="chat-container p-4">
                    <div className="chat chat-left">
                        <div className="dp-container">
                            <img src="/assets/onika.jpg" className="w-[100px]" alt=""></img>
                        </div>
                        <div className="message-container">
                            <div className="message bg-gray-100 dark:bg-gray-900" >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </div>
                            <div className="message bg-gray-100 dark:bg-gray-900">
                                Lorem ipsum
                            </div>
                        </div>
                    </div>
                    <div className="chat chat-right">
                        <div className="message-container">
                            <div className="message-box">
                                <span
                                    className="message message-right bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
                                >
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </span>
                                <span
                                    className="recipient-dp"
                                    style={{display: 'none'}}
                                >
                                    <img src="/assets/onika.jpg" alt=""></img>
                                </span>
                            </div>
                            <div className="message-box">
                                <span
                                    className="message message-right  bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
                                >
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                    Distinctio aliquam natus consequatur tenetur ab et est repellat, nesciunt sint libero, amet nam facere. Quis,
                                    atque odio. Dolorem vitae fugit harum.
                                </span>
                                <span className="recipient-dp" style={{ display: 'none' }}>
                                    <img src="/assets/onika.jpg" alt=""></img>
                                </span>
                            </div>
                            <div className="message-box">
                                <span
                                    className="message message-right  bg-gray-900 text-white dark:bg-gray-100 dark:text-black"
                                >
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </span>
                                <span className="recipient-dp">
                                    <img src="/assets/onika.jpg" alt=""></img>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="chat chat-left">
                        <div className="dp-container">
                            <img src="/assets/onika.jpg" className="w-[100px]" alt=""></img>
                        </div>
                        <div className="message-container">
                            <div
                                className="message bg-gray-100 dark:bg-gray-900"
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </div>
                            <div
                                className="message bg-gray-100 dark:bg-gray-900"
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat facilis, accusamus ea ab quaerat minima ullam ipsam
                                dolores? Consequuntur, ratione. Ab vel accusamus suscipit quibusdam sint ut sequi expedita vitae.
                            </div>
                            <div
                                className="message bg-gray-100 dark:bg-gray-900"
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat facilis, accusamus ea ab quaerat minima ullam ipsam
                                dolores? Consequuntur, ratione. Ab vel accusamus suscipit quibusdam sint ut sequi expedita vitae.
                            </div>
                            <div
                                className="message bg-gray-100 dark:bg-gray-900"
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat facilis, accusamus ea ab quaerat minima ullam ipsam
                                dolores? Consequuntur, ratione. Ab vel accusamus suscipit quibusdam sint ut sequi expedita vitae.
                            </div>
                            <div
                                className="message bg-gray-100 dark:bg-gray-900"
                            >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat facilis, accusamus ea ab quaerat minima ullam ipsam
                                dolores? Consequuntur, ratione. Ab vel accusamus suscipit quibusdam sint ut sequi expedita vitae.
                            </div>
                        </div>
                    </div>
                </div>
                <form className="chat-sendbox p-4" onSubmit={sendMessage}>
                    <div className="image-file-container hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
                        <label
                            htmlFor="image-file"
                            className="image-file"
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
                        <textarea
                            name="message"
                            placeholder="Write your message..."
                            id=""
                            className="message-input-box bg-gray-100 focus:bg-transparent border-1 focus:border-gray-100 border-transparent scrollbar-hide dark:bg-gray-900" 
                            onChange={(e) => setData('message', e.target.value)}
                            value={data.message}
                        ></textarea>
                    </div>
                    <div className="send-button-container hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
                        <button type='submit'>
                            <SendHorizonal className='w-[30px] h-[30px] text-[#171717] dark:text-gray-100'/>
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
