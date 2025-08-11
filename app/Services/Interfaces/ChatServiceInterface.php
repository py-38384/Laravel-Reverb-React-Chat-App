<?php

namespace App\Services\Interfaces;

use App\Models\Message;

interface ChatServiceInterface
{
    public function create($data);
    public function getMessage($conversation, $offsetAmount);
    public function getUnreadMessage($user);
    
}
