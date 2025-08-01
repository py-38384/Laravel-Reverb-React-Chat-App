<?php

namespace App\Models;

use App\Models\User;
use App\Traits\HasUlidPrimaryKey;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasUlidPrimaryKey;
    public $incrementing = false;
    public $keyType = "string";
    protected $guarded = ['id', 'created_at','updated_at'];
    public function users(){
        return self::belongsToMany(User::class, "conversation_user",'conversation_id','user_id');
    }
    public function lastMessage()
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }
}
