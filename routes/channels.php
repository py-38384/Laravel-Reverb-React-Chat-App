<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('message-channel.{receiver_id}', function($user, $receiver_id){
    return $user->id == $receiver_id;
});
