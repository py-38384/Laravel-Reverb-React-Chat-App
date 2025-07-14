import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { User } from '@/types/model';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List of users',
        href: '/dashboard',
    },
];

export default function Dashboard({users}: {users: User[]}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Users" />
             <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-900 dark:text-white">
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">SL</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">Name</th>   
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">Email</th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left w-12">Action</th>
                    </tr>
                </thead>
                <tbody>
                        {users.map((user: User, index: number) => (
                        <tr key={user.id}>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{index+1}</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{user.name}</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{user.email}</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 relative">
                                <Link href={route('chat',user.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </Link>
                                <span className={`top-0 left-[45px] absolute ${user.receive_message_count > 0 ? "block": "hidden"} text-red-500 font-bold`}>{user.receive_message_count}</span>

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
