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
        return Message::create($data);
    }
    public function all($user_id = '', $sender_id = ''){
        if($user_id && !$sender_id){
            return Message::where('receiver_id', $user_id)->orderBy('created_at')->get();
        } else if($user_id && $sender_id){
            return Message::where(function($query) use($user_id, $sender_id){
                $query->where('receiver_id', $user_id)
                    ->where('sender_id', $sender_id);
            })->orWhere(function($query) use($user_id, $sender_id) {
                $query->where('receiver_id', $sender_id)
                    ->where('sender_id', $user_id);
            })->orderBy('created_at')->get();
        }
        return Message::orderBy('created_at')->all();
    }
    public function getAllUnread($user_id, $sender_id){
        return Message::where('receiver_id', $user_id)
                        ->where('sender_id', $sender_id)
                        ->where('is_read', false)
                        ->get();
    }
}
