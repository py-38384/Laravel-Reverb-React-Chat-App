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
    public function all($conversation = null){
        if($conversation){
            $messages = Message::with('message_seen')->where('conversation_id', $conversation->id)->with('images:id,message_id')->orderBy('created_at')->get();
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
    public function message_exist($auth_user_id, $other_user_id){
        $exist = Message::where(function($query) use($auth_user_id, $other_user_id){
                $query->where('receiver_id', $auth_user_id)
                    ->where('sender_id', $other_user_id);
            })->orWhere(function($query) use($auth_user_id, $other_user_id) {
                $query->where('receiver_id', $auth_user_id)
                    ->where('sender_id', $other_user_id);
            })->exists();
        return $exist;
    }
    public function getAllUnread($user_id, $sender_id){
        return Message::where('receiver_id', $user_id)
                        ->where('sender_id', $sender_id)
                        ->where('is_read', false)
                        ->get();
    }
}
