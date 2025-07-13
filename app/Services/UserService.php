<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Services\Interfaces\UserServiceInterface;

class UserService implements UserServiceInterface
{
    private $userRepository;
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }
    /**
     * Summary of getAllOtherUser
     * function: getAllOtherUser
     * Description: A Service function for getting all user except currently authenticated user
     * @return \Illuminate\Database\Eloquent\Collection<int, \App\Models\User>
     */
    public function getAllOtherUser(){
        return $this->userRepository->get_all_user_without_the_current();
    }
    public function getSingleUser(string $user_id){
        return $this->userRepository->find($user_id);
    }
}
