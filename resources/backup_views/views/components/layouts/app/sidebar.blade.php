<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        @include('partials.head')
    </head>
    @yield('css')
    @yield('prepend-script')
    @livewireStyles
    @livewireScripts 
    <body class="min-h-screen bg-white dark:bg-zinc-800">
        <flux:sidebar sticky stashable class="border-e border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
            <flux:sidebar.toggle class="lg:hidden" icon="x-mark" />

            <a href="{{ route('dashboard') }}" class="me-5 flex items-center space-x-2 rtl:space-x-reverse" wire:navigate>
                <x-app-logo />
            </a>

            <flux:navlist variant="outline">
                <flux:navlist.group :heading="__('Platform')" class="grid">
                    <flux:navlist.item icon="home" :href="route('dashboard')" :current="request()->routeIs('dashboard')" wire:navigate>{{ __('Dashboard') }}</flux:navlist.item>
                </flux:navlist.group>
            </flux:navlist>

            <flux:spacer />

            <flux:navlist variant="outline">
                <flux:navlist.item icon="folder-git-2" href="https://github.com/laravel/livewire-starter-kit" target="_blank">
                {{ __('Repository') }}
                </flux:navlist.item>

                <flux:navlist.item icon="book-open-text" href="https://laravel.com/docs/starter-kits#livewire" target="_blank">
                {{ __('Documentation') }}
                </flux:navlist.item>
            </flux:navlist>

            <!-- Desktop User Menu -->
            <flux:dropdown class="hidden lg:block" position="bottom" align="start">
                <flux:profile
                    :name="auth()->user()->name"
                    :initials="auth()->user()->initials()"
                    icon:trailing="chevrons-up-down"
                />

                <flux:menu class="w-[220px]">
                    <flux:menu.radio.group>
                        <div class="p-0 text-sm font-normal">
                            <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                                <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                                    <span
                                        class="flex h-full w-full items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white"
                                    >
                                        {{ auth()->user()->initials() }}
                                    </span>
                                </span>

                                <div class="grid flex-1 text-start text-sm leading-tight">
                                    <span class="truncate font-semibold">{{ auth()->user()->name }}</span>
                                    <span class="truncate text-xs">{{ auth()->user()->email }}</span>
                                </div>
                            </div>
                        </div>
                    </flux:menu.radio.group>

                    <flux:menu.separator />

                    <flux:menu.radio.group>
                        <flux:menu.item :href="route('settings.profile')" icon="cog" wire:navigate>{{ __('Settings') }}</flux:menu.item>
                    </flux:menu.radio.group>

                    <flux:menu.separator />

                    <form method="POST" action="{{ route('logout') }}" class="w-full">
                        @csrf
                        <flux:menu.item as="button" type="submit" icon="arrow-right-start-on-rectangle" class="w-full">
                            {{ __('Log Out') }}
                        </flux:menu.item>
                    </form>
                </flux:menu>
            </flux:dropdown>
        </flux:sidebar>

        <!-- Mobile User Menu -->
        <flux:header class="lg:hidden">
            <flux:sidebar.toggle class="lg:hidden" icon="bars-2" inset="left" />

            <flux:spacer />

            <flux:dropdown position="top" align="end">
                <flux:profile
                    :initials="auth()->user()->initials()"
                    icon-trailing="chevron-down"
                />

                <flux:menu>
                    <flux:menu.radio.group>
                        <div class="p-0 text-sm font-normal">
                            <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                                <span class="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-lg">
                                    <span
                                        class="flex h-full w-full items-center justify-center rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white"
                                    >
                                        {{ auth()->user()->initials() }}
                                    </span>
                                </span>

                                <div class="grid flex-1 text-start text-sm leading-tight">
                                    <span class="truncate font-semibold">{{ auth()->user()->name }}</span>
                                    <span class="truncate text-xs">{{ auth()->user()->email }}</span>
                                </div>
                            </div>
                        </div>
                    </flux:menu.radio.group>

                    <flux:menu.separator />

                    <flux:menu.radio.group>
                        <flux:menu.item :href="route('settings.profile')" icon="cog" wire:navigate>{{ __('Settings') }}</flux:menu.item>
                    </flux:menu.radio.group>

                    <flux:menu.separator />

                    <form method="POST" action="{{ route('logout') }}" class="w-full">
                        @csrf
                        <flux:menu.item as="button" type="submit" icon="arrow-right-start-on-rectangle" class="w-full">
                            {{ __('Log Out') }}
                        </flux:menu.item>
                    </form>
                </flux:menu>
            </flux:dropdown>
        </flux:header>

        {{ $slot }}

        @fluxScripts
    </body>
    <script>
    (function defindAppearance(){
        const dependent_elements = document.querySelectorAll("[data-appearance]")
        const hover_dependent_elements = document.querySelectorAll("[data-hover-appearance]")
        const focus_dependent_elements = document.querySelectorAll("[data-focus-appearance]")

        const appearance = localStorage.getItem('flux.appearance')

        if(appearance && appearance === 'light'){
            dependent_elements.forEach((element) => {
                const appearance_class = element.dataset.lightModeClass
                element.classList.add(appearance_class)
            })
            hover_dependent_elements.forEach((element) => {
                const hover_appearance_class = element.dataset.lightModeHoverClass
                element.addEventListener('mouseenter', () => {
                    element.classList.add(hover_appearance_class); // Apply hover effect
                });

                element.addEventListener('mouseleave', () => {
                    element.classList.remove(hover_appearance_class); // Remove hover effect
                });
            })
            focus_dependent_elements.forEach((element) => {
                const focus_appearance_class = element.dataset.lightModeFocusClass
                element.addEventListener('focus', () => {
                    if(focus_appearance_class){
                        element.classList.add(focus_appearance_class);
                    }
                });
                
                element.addEventListener('blur', () => {
                    if(focus_appearance_class){
                        element.classList.remove(focus_appearance_class);
                    }
                });
            })
        } else {
            dependent_elements.forEach((element) => {
                const appearance_class = element.dataset.darkModeClass
                element.classList.add(appearance_class)
            })
            hover_dependent_elements.forEach((element) => {
                const hover_appearance_class = element.dataset.darkModeHoverClass
                element.addEventListener('mouseenter', () => {
                    element.classList.add(hover_appearance_class); // Apply hover effect
                });

                element.addEventListener('mouseleave', () => {
                    element.classList.remove(hover_appearance_class); // Remove hover effect
                });
            })
            focus_dependent_elements.forEach((element) => {
                const focus_appearance_class = element.dataset.darkModeFocusClass
                element.addEventListener('focus', (e) => {
                    if(focus_appearance_class){
                        element.classList.add(focus_appearance_class);
                    }
                });

                element.addEventListener('blur', (e) => {
                    if(focus_appearance_class){
                        element.classList.remove(focus_appearance_class);
                    }
                });
            })
        }
    })()
    </script>
</html>
