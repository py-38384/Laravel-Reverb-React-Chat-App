<?php

namespace App\Repositories;

use App\Models\Message;
use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {

    }
    /**
     * Summary of get_all_user_without_the_current
     * Function: get_all_user_without_the_current
     * Description: A Repository function for getting all user except currently authenticated user
     * @return \Illuminate\Database\Eloquent\Collection<int, User>
     */
    public function get_all_user_without_the_current(){
        $users = User::where('id','!=',auth()->id())->get()->map(function ($user){
            $user->unreadMessage =  $user->getUnreadMessageCount();
            $user->lastMessage = Message::where(function($query) use($user){
                $query->where('receiver_id', $user->id)
                ->where('sender_id', auth()->id());
            })->orWhere(function($query) use($user) {
                $query->where('receiver_id', auth()->id())
                ->where('sender_id', $user->id);
            })->orderBy("created_at","desc")->first();
            if($user->lastMessage){
                $user->lastMessage->created_at_human = $user->lastMessage->created_at->diffForHumans();
            }
            return $user;
        });
        return $users;
    }
    /**
     * Summary of find
     * Function: find
     * Description: A Repository function for getting specific user by there id
     * @return \App\Models\User
     */

    public function find(string $userId){
        return User::find($userId);
    }
}
