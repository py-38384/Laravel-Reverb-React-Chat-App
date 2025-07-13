<?php

namespace App\Services\Interfaces;

interface UserServiceInterface
{
    public function getAllOtherUser();
    public function getSingleUser(string $user_id);
}
