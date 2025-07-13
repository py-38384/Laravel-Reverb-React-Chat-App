<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface
{
    public function get_all_user_without_the_current();
    public function find(string $userId);
}
