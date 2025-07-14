<?php

namespace App\Services\Interfaces;

use App\Models\Message;

interface ChatServiceInterface
{
    public function create($data): Message;
    public function getAllMessage();
}
