<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SendMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public function __construct($newMessage)
    {
        $this->message = $newMessage->load('sender:id,name', 'conversation','images:id,message_id');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $conversation = $this->message->conversation;
        $allUser = $conversation->users;
        $otherUsers = $allUser->filter(function($user){
            return $user->id != auth()->id();
        });
        $channels = [];
        foreach ($otherUsers as $key => $user) {
            $channels[] = new PrivateChannel('user.'.$user->id); 
        }
        $channels[] = new PrivateChannel('conversation.' . $this->message->conversation_id);
        return $channels;
    }
}
