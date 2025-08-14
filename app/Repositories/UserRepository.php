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
     * @return \Illuminate\Pagination\LengthAwarePaginator<int, User>
     */
    public function getAllUsersExceptMe()
    {
        $authId = auth()->id();
        return User::whereKeyNot($authId)
            ->whereDoesntHave('receivedFriendships', function ($q) use ($authId) {
                $q->where('requester_id', $authId);
            })
            ->whereDoesntHave('sentFriendships', function ($q) use ($authId) {
                $q->where('addressee_id', $authId);
            })
            ->orderBy('created_at')
            ->limit(config('constant.pagination'))
            ->get();
    }
    /**
     * Summary of find
     * Function: find
     * Description: A Repository function for getting specific user by there id
     * @return \App\Models\User
     */

    public function find(string $userId)
    {
        return User::find($userId);
    }
}
