<?php

namespace App\Repositories;

use App\Models\Message;
use App\Repositories\Interfaces\ChatRepositoryInterface;

class ChatRepository implements ChatRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    public function create($data): Message {
        $newMessage =  Message::create($data);
        $newMessage->created_at_human = $newMessage->created_at->diffForHumans();
        return $newMessage;
    }
    public function all($user_id = '', $sender_id = ''){
        if($user_id && !$sender_id){
            $messages = Message::where('receiver_id', $user_id)->orderBy('created_at')->get();
        } else if($user_id && $sender_id){
            $messages = Message::where(function($query) use($user_id, $sender_id){
                $query->where('receiver_id', $user_id)
                    ->where('sender_id', $sender_id);
            })->orWhere(function($query) use($user_id, $sender_id) {
                $query->where('receiver_id', $sender_id)
                    ->where('sender_id', $user_id);
            })->orderBy('created_at')->get();
        } else {
            $messages = Message::orderBy('created_at')->get();
        }

        foreach ($messages as $message) {
            $message->created_at_human = $message->created_at->diffForHumans();

            // Add a field for diffForHumans only if at least 24 hours have passed since previous message
            $message->created_at_human_24h = null;
        }

        // Add created_at_human_24h for messages with at least 24h interval
        $prevCreatedAt = null;
        foreach ($messages as $message) {
            if ($prevCreatedAt) {
                $diffInHours = $message->created_at->diffInHours($prevCreatedAt);
                if ($diffInHours >= 24) {
                    $message->created_at_human_24h = $message->created_at->diffForHumans($prevCreatedAt);
                }
            } else {
                // For the first message, you may want to show the field or leave it null
                $message->created_at_human_24h = $message->created_at->diffForHumans();
            }
            $prevCreatedAt = $message->created_at;
        }

        return $messages;
    }
    public function getAllUnread($user_id, $sender_id){
        return Message::where('receiver_id', $user_id)
                        ->where('sender_id', $sender_id)
                        ->where('is_read', false)
                        ->get();
    }
}
