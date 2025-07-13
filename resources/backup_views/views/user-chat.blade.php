<x-layouts.app :title="__('User Chat')">
    @livewire('chat', ['userId' => $userId])
</x-layouts.app>