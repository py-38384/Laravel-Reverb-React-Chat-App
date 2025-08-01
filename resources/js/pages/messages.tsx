import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Conversations, User } from '@/types/model';
import { useInitials } from '@/hooks/use-initials';
import useCurrentUser from '@/hooks/use-current-user';
import { useEcho } from '@laravel/echo-react';
import { Message } from '@/types/model';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List of users',
        href: '/messages',
    },
];

export default function Messages({conversations}: {conversations: Conversations[]}) {
    console.log(conversations)
    const getInitials = useInitials()
    const currentUser = useCurrentUser()
    const getOtherUserFromPrivateChat = (conversation: Conversations) => {
        const bothUser = conversation.users
        return bothUser[0].id !== currentUser.id? bothUser[0]: bothUser[1]; 
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Users" />
             <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-900 dark:text-white">
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">Photo</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">Name</th>   
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">Last Message</th>   
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">Last Message Time</th>   
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">Email</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">Action</th>
                    </tr>
                </thead>
                <tbody>
                        {conversations.map((conversation: Conversations, index: number) => (
                        <tr key={conversation.id}>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            {conversation.type === "private"? 
                                    getOtherUserFromPrivateChat(conversation)?.image?(
                                        <img className='w-[45px] h-[45px] rounded-full flex items-center justify-center' src={getOtherUserFromPrivateChat(conversation)?.image} alt=""></img>
                                    ):(
                                        <div className='bg-gray-200 w-[45px] h-[45px] rounded-full flex items-center justify-center'>{getInitials(getOtherUserFromPrivateChat(conversation).name)}</div>
                                    )
                                : (
                                    <div className='bg-gray-200 w-[45px] h-[45px] rounded-full flex items-center justify-center'>{getInitials("Group")}</div>
                                )
                            }
                            </td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{getOtherUserFromPrivateChat(conversation).name}</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Test</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Test</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Test</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 relative">
                                <Link href="Test">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </Link>
                                <span className={`top-0 left-[45px] absolute ${false ? "block": "hidden"} text-red-500 font-bold`}>test</span>

                            </td>
                        </tr>
                        ))}
                </tbody>
            </table>
        </div>
    </div>
        </AppLayout>
    );
}
