<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $guarded = ['id', 'created_at','updated_at'];
    public function users(){
        return self::belongsToMany(User::class, "conversation_user",'user_id','conversation_id');
    }
}
