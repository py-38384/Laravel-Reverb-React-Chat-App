import Paginate from '@/components/paginate';
import useCurrentUser from '@/hooks/use-current-user';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { User } from '@/types/model';
import { Paginate as PaginateInterface } from '@/types/paginate';
import { Head, Link } from '@inertiajs/react';
import { clear } from 'console';
import { Ban, UserPlus, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List of users',
        href: '/messages',
    },
];

export default function Messages({ users }: { users: PaginateInterface }) {
    const getInitials = useInitials();
    const currentUser = useCurrentUser();
    const [showSearchClear, setShowSearchClear] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const clearSearchInput = () => {
        setSearchInput('')
    }
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setSearchInput(e.target.value)
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Users" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
                <div className="overflow-x-auto">
                    <div>
                        <div className='px-0.5 relative'>
                            <input onFocus={() => setShowSearchClear(true)} onBlur={() => setTimeout(() => setShowSearchClear(false), 200)} value={searchInput} onChange={handleSearchInput} type="text" placeholder='Search user' className='outline-none bg-gray-100 my-1 px-3 w-full h-[40px] rounded-[5px]'/>
                            <button className={`absolute right-0 top-1 hover:bg-gray-200 h-[40px] w-[40px] items-center justify-center cursor-pointer ${showSearchClear? 'flex': 'hidden'}`} onClick={clearSearchInput}><X className='h-[30px] w-[30px]'/></button>
                        </div>
                    </div>
                    <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-900 dark:text-white">
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Photo</th>
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Name</th>
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Email</th>
                                <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user: User, index: number) => (
                                <tr key={user.id}>
                                    <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">
                                        {user.image ? (
                                            <img
                                                className="flex h-[45px] w-[45px] items-center justify-center rounded-full"
                                                src={`/${user.image}`}
                                                alt=""
                                            ></img>
                                        ) : (
                                            <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-gray-200">
                                                {getInitials(user.name)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">{user.name}</td>
                                    <td className="border border-gray-300 px-4 py-2 dark:border-gray-700">{user.email}</td>
                                    <td className="relative border border-gray-300 px-4 py-2 dark:border-gray-700">
                                        <div className="flex">
                                            <Link href={route('chat', user.id)}>
                                                <UserPlus className="h-[35px] w-[35px] rounded p-1.5 hover:bg-gray-100" />
                                            </Link>
                                            <Link href={route('chat', user.id)}>
                                                <Ban className="h-[35px] w-[35px] rounded p-1.5 hover:bg-gray-100" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Paginate data={users} />
                </div>
            </div>
        </AppLayout>
    );
}
