<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return $user->id === $id;
});
Broadcast::channel('user.{id}', function ($user, $id) {
    return $user->id === $id;
});
Broadcast::channel('conversation.{conversation_id}', function($user, $conversation_id){
    $conversation = Conversation::with('users')->find($conversation_id);
    if (!$conversation) {
        return false;
    }
    return $conversation->users->contains('id', $user->id);
});
