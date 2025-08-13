import Paginate from '@/components/paginate';
import useCurrentUser from '@/hooks/use-current-user';
import useDebounce from '@/hooks/use-debounce';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { User } from '@/types/model';
import { Paginate as PaginateInterface } from '@/types/paginate';
import { Head, Link, useForm } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { Ban, UserPlus, Search, X, Users, Undo2, UserMinus, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Spinner from '@/components/spinner';
import { SpinnerCircular } from 'spinners-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List of users',
        href: '/messages',
    },
];

export default function Request({ users }: { users: PaginateInterface }) {
    const bearerToken = localStorage.getItem('bearerToken');
    const [usersData, setUserData] = useState(users.data)
    const getInitials = useInitials();
    const currentUser = useCurrentUser();
    const [backupUserData, setBackupUserData] = useState(users); 
    const [searchInputActive, setSearchInputActive] = useState(false);
    const [showPagination, setShowPagination] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearchInput = useDebounce(searchInput);
    const {} = useForm({

    })
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
        enabled: !!debouncedSearchInput, // only run query if searchTerm is not empty
    });
    useEffect(() => {
        isSuccess? setUserData(data): null
    },[data, isSuccess])
    const clearSearchInput = () => {
        setSearchInput('')
        setUserData(backupUserData.data)
        setShowPagination(true)
    }
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        if(!e.target.value){
            setShowPagination(true)
            setUserData(backupUserData.data)
        } else {
            setShowPagination(false)
        }
    }
    const handleCancelFriendRequest = async (id: string) => {
        const res = await fetch('/api/remove/request', {
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
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Users" />
            {usersData.length > 0?(
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
                <div className="overflow-x-auto">
                    <div>
                        <div className='px-0.5 relative'>
                            <input onFocus={() => setSearchInputActive(true)} onBlur={() => setTimeout(() => setSearchInputActive(false), 200)} value={searchInput} onChange={handleSearchInput} type="text" placeholder='Search user' className='outline-none bg-gray-100 my-1 px-3 w-full h-[40px] rounded-[5px]'/>
                            <button className={`absolute right-0 top-1 hover:bg-gray-200 h-[40px] w-[40px] items-center justify-center cursor-pointer ${searchInputActive? 'flex': 'hidden'}`} onClick={clearSearchInput}><X className='h-[30px] w-[30px]'/></button>
                        </div>
                    </div>
                    {isLoading?(
                        <div className='w-full h-[80vh] flex items-center justify-center'>
                            <SpinnerCircular color='black' secondaryColor='#E5E7EB'/>
                        </div>
                    ):(
                        <>
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
            
                                                    <button title='Reject Request' onClick={() => handleCancelFriendRequest(user.id)}>
                                                        <X className="h-[35px] w-[35px] rounded p-1.5 hover:bg-gray-100" />
                                                    </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {showPagination && <Paginate data={users} />}
                        </>
                    )}
                </div>
            </div>
            ):(
            <h1 className='w-full flex items-center justify-center h-[30rem] text-center text-3xl font-semibold'>No Friend Request Found!</h1>
            )}
        </AppLayout>
    );
}
