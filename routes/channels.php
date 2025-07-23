<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return $user->id === $id;
});
Broadcast::channel('message-channel.{receiver_id}', function($user, $receiver_id){
    return $user->id == $receiver_id;
});
Broadcast::channel('message-notification-channel.{receiver_id}', function($user, $receiver_id){
    return $user->id == $receiver_id;
});
