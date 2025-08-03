import { getOtherUserFromPrivateChat } from '@/helper';
import useCurrentUser from '@/hooks/use-current-user';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Conversations } from '@/types/model';
import { Head, Link } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List of users',
        href: '/messages',
    },
];

export default function Messages({ conversations }: { conversations: Conversations[] }) {
    const getInitials = useInitials()
    const currentUser = useCurrentUser()
    const handleMessageReceive = (e: MessageEvent) => {
        console.log(e)
    }
    useEcho(
        `user.${currentUser.id}`,
        `SendMessage`,
        handleMessageReceive,
    );
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Users" />
            {conversations.length > 0?(
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-900 dark:text-white">
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Photo</th>
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Name</th>
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Last Message</th>
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Last Message Time</th>
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Email</th>
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conversations.map((conversation: Conversations, index: number) => {
                                const otherUser = conversation.type === 'private' ? getOtherUserFromPrivateChat(conversation) : null;
                                if (conversation.type === 'private') {
                                    return (
                                        <tr key={conversation.id}>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">
                                                {getOtherUserFromPrivateChat(conversation)?.image ? (
                                                    <img
                                                        className="flex h-[45px] w-[45px] items-center justify-center rounded-full"
                                                        src={getOtherUserFromPrivateChat(conversation)?.image}
                                                        alt=""
                                                    ></img>
                                                ) : (
                                                    <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">
                                                        {getInitials(getOtherUserFromPrivateChat(conversation).name)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">
                                                {getOtherUserFromPrivateChat(conversation).name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">Test</td>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">Test</td>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">Test</td>
                                            <td className="relative border border-gray-300 px-4 py-2 dark:border-gray-700">
                                                <Link href={route('chat', conversation.id)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                                        />
                                                    </svg>
                                                </Link>
                                                <span className={`absolute top-0 left-[45px] ${false ? 'block' : 'hidden'} font-bold text-red-500`}>
                                                    test
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    return (
                                        <tr key={conversation.id}>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">
                                                <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">
                                                    {getInitials('Group')}
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">Group</td>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">Test</td>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">Test</td>
                                            <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">Test</td>
                                            <td className="relative border border-gray-300 px-4 py-2 dark:border-gray-700">
                                                <Link href={route('chat', conversation.id)}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                                        />
                                                    </svg>
                                                </Link>
                                                <span className={`absolute top-0 left-[45px] ${false ? 'block' : 'hidden'} font-bold text-red-500`}>
                                                    test
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            ):(
                <h1 className='w-full flex items-center justify-center h-[30rem] text-center text-3xl font-semibold'>No Conversation Found!</h1>
            )}
        </AppLayout>
    );
}
