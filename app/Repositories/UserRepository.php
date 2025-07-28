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
            ->select('users.*')
            ->selectRaw('EXISTS (
        SELECT 1 FROM friendships
        WHERE status = ?
          AND (
              (requester_id = ? AND addressee_id = users.id)
              OR
              (requester_id = users.id AND addressee_id = ?)
          )
    ) as is_pending', ['pending', $authId, $authId])
            ->selectRaw('EXISTS (
        SELECT 1 FROM friendships
        WHERE status = ?
          AND (
              (requester_id = ? AND addressee_id = users.id)
              OR
              (requester_id = users.id AND addressee_id = ?)
          )
    ) as is_accepted', ['accepted', $authId, $authId])
            ->selectRaw('EXISTS (
        SELECT 1 FROM friendships
        WHERE status = ?
          AND (
              (requester_id = ? AND addressee_id = users.id)
              OR
              (requester_id = users.id AND addressee_id = ?)
          )
    ) as is_blocked', ['blocked', $authId, $authId])
            ->paginate(10);
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
