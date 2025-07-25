<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface
{
    public function getAllUsersExceptMe();
    public function find(string $userId);
}
