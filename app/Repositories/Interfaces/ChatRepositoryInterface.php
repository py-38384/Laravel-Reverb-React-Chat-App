<?php

namespace App\Repositories\Interfaces;

use App\Models\Message;

interface ChatRepositoryInterface
{
    public function create($data):Message;
}
