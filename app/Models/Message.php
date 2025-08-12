<?php

namespace App\Models;

use App\Observers\MessageObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([MessageObserver::class])]
class Message extends Model
{
    protected $guarded = [];
    public function sender(){
        return $this->belongsTo(User::class, 'sender_id','id');
    }
    public function conversation(){
        return $this->belongsTo(Conversation::class, 'conversation_id','id');
    }
    public function images(){
        return $this->hasMany(Image::class);
    }
    public function message_seen(){
        return $this->belongsToMany(User::class, 'message_seen','message_id','user_id');
    }
}
