<?php

namespace App\Repositories\Interfaces;

use App\Models\Message;

interface ChatRepositoryInterface
{
    public function create($data):Message;
    public function all();
    public function getAllUnread($user_id, $sender_id);
}
