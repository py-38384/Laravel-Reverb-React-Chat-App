import useDebounce from '@/hooks/use-debounce';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { User } from '@/types/model';
import { Head } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { Undo2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List of users',
        href: '/messages',
    },
];

export default function Blocks({ users }: { users: User[] }) {
    const bearerToken = localStorage.getItem('bearerToken');
    const [usersData, setUserData] = useState(users)
    const getInitials = useInitials();
    const [showPagination, setShowPagination] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearchInput = useDebounce(searchInput);
    const fetchSearchUserData = async (debouncedSearchInput: string) => {
        const res = await fetch('/api/users/search',{
            method: "POST",
            headers: {
                accept: "application/json",
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify({
                q: debouncedSearchInput
            })
        })
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
    }
    const { data, isSuccess, refetch, isLoading, isError } = useQuery({
        queryKey: ["search", debouncedSearchInput],
        queryFn: () => fetchSearchUserData(debouncedSearchInput),
        enabled: !!debouncedSearchInput,
    });
    useEffect(() => {
        isSuccess? setUserData(data): null
    },[data, isSuccess])
    const handleUnBlock = async (id: string) => {
        if(!confirm('Are You Sure You Want To UnBlock This User?')) return 
        const res = await fetch('/api/unblock/request', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`,
            },
            body: JSON.stringify({
                id: id,
            }),
        });
        const data = await res.json();
        if (data?.status == 'success') {
            setUserData((preUserData) => preUserData.filter(user => user.id !== id));
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Users" />
            {usersData.length > 0?(
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
                
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
                    {usersData?.map((user: User) => (
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
                                    <button title='Send Message' onClick={() => handleUnBlock(user.id)}>
                                        <Undo2 className="h-[35px] w-[35px] rounded p-1.5 hover:bg-gray-100" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            ):(
                <h1 className='w-full flex items-center justify-center h-[30rem] text-center text-3xl font-semibold'>No Friend Found!</h1>
            )}
        </AppLayout>
    );
}
