<x-layouts.app :title="__('Dashboard')">
    <div class="flex h-full w-full flex-1 flex-col gap-4 rounded-xl">
        <h1 class="text-2xl font-bold">List of Users</h1>
        <div class="overflow-x-auto">
            <table class="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-gray-100 dark:bg-gray-900 dark:text-white">
                        <th class="border border-gray-300 px-4 py-2 text-left w-12">SL</th>
                        <th class="border border-gray-300 px-4 py-2 text-left w-12">Name</th>   
                        <th class="border border-gray-300 px-4 py-2 text-left w-12">Email</th>
                        <th class="border border-gray-300 px-4 py-2 text-left w-12">Action</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($users as $user)
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">{{ $loop->index+1 }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ $user->name }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ $user->email }}</td>
                            <td class="border border-gray-300 px-4 py-2">
                                <a wire:navigate href="{{ route('chat', $user->id) }}">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </a>

                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</x-layouts.app>
