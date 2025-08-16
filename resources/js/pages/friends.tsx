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
import { Ban, UserPlus, Search, X, Users, Undo2, UserMinus, Check, MessageSquare } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Spinner from '@/components/spinner';
import { SpinnerCircular } from 'spinners-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'List of users',
        href: '/messages',
    },
];

export default function Request({ users }: { users: User[] }) {
    const bearerToken = localStorage.getItem('bearerToken');
    const [usersData, setUserData] = useState(users)
    const getInitials = useInitials();
    const currentUser = useCurrentUser();
    const [backupUserData, setBackupUserData] = useState(users); 
    const [searchInputActive, setSearchInputActive] = useState(false);
    const [showPagination, setShowPagination] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearchInput = useDebounce(searchInput);
    const startConversation = useForm({user_id: ''})
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
    const handleStartConversation = async(id: string) => {
        startConversation.post(route('chat.start',id), {
            onSuccess: (page) => {
                console.log(page.props);
            }
        })
    }

    const containerRef = useRef<HTMLDivElement | null>(null)
    const tbodyRef = useRef<HTMLTableSectionElement | null>(null)
    const [userOffset,setUserOffset] = useState(2)
    const [moreUserAvailable, setMoreUserAvailable] = useState(true);
    const oldScrollHeightRef = useRef(0)
    let lastCall = 0
    const loadMoreUsers = () => {
        setUserOffset((prev) => {
            getSetUsers(prev)
            const newUserOffset = prev+1
            return newUserOffset
        });
    };
    const getSetUsers = async (offset: number) => {
        try {
            const bearerToken = localStorage.getItem('bearerToken');
            const res = await fetch(route('user.global'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    offsetAmount: offset,
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const resData = await res.json();

            if (resData.status === 'success') {
                if(resData.data.length > 0){
                    setUserData(prev => [...prev, ...resData.data])
                } else {
                    setMoreUserAvailable(false)
                }
            }
        } catch (err) {
            console.error('Failed to fetch older messages:', err);
            return false
        } finally {

        }
    };
    const handleUnfriendRequest = async (id: string) => {
        if(!confirm('Are You Sure You Want To Unfriend This Person?')) return
        
        const bearerToken = localStorage.getItem('bearerToken');
            const res = await fetch(route('user.unfriend'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    id: id,
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const resData = await res.json();

            if (resData.status === 'success') {
                setUserData(prev => prev.filter(user => user.id !== id))
            }
    }
    useEffect(() => {
        let debouncer: ReturnType<typeof setTimeout>
        const handleLoad = (e: Event) => {
            const target = e.target as HTMLTableElement
            if((target.scrollHeight - (target.scrollTop + target.clientHeight)) < 50){
                const now = Date.now()
                if(now - lastCall > 100){
                    const container = containerRef.current
                    if (container) {
                        oldScrollHeightRef.current = container.scrollHeight
                    }
                    lastCall = now

                    setMoreUserAvailable(prev => {
                        if(prev){
                            loadMoreUsers()
                        }
                        return prev
                    })

                    if (debouncer) clearTimeout(debouncer)
                    debouncer = setTimeout(() => {
                        lastCall = 0; 
                    }, 1000)
                }
            }
        }
        const container = containerRef.current
        container?.addEventListener('scroll',handleLoad)

        return () => {
            container?.removeEventListener('scroll', handleLoad)
        }
    },[])
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of Users" />
            {usersData.length > 0?(
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
                <div className="overflow-x-auto">
                    {isLoading?(
                        <div className='w-full h-[80vh] flex items-center justify-center'>
                            <SpinnerCircular color='black' secondaryColor='#E5E7EB'/>
                        </div>
                    ):(
                        <div className='overflow-y-scroll max-h-[80vh]' ref={containerRef}>
                        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-900 dark:text-white">
                                    <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Photo</th>
                                    <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Name</th>
                                    <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Email</th>
                                    <th className="w-12 border border-gray-300 px-4 py-2 text-left dark:border-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody ref={tbodyRef}>
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
                                                    <button title='Send Message' onClick={() => handleStartConversation(user.id)}>
                                                        <MessageSquare className="h-[35px] w-[35px] rounded p-1.5 hover:bg-gray-100" />
                                                    </button>
                                                    <button title='Unfriend' onClick={() => handleUnfriendRequest(user.id)}>
                                                        <UserMinus className="h-[35px] w-[35px] rounded p-1.5 hover:bg-gray-100" />
                                                    </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    )}
                </div>
            </div>
            ):(
                <h1 className='w-full flex items-center justify-center h-[30rem] text-center text-3xl font-semibold'>No Friend Found!</h1>
            )}
        </AppLayout>
    );
}
