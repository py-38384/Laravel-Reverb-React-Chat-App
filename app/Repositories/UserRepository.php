<?php

namespace App\Repositories;

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
        return User::where('id','!=',auth()->id())->get()->map(function ($user){
            $user->unreadMessage =  $user->getUnreadMessageCount();
            return $user;
        });
    }
    public function find(string $userId){
        return User::find($userId);
    }
}
