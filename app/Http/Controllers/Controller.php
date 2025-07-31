<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Support\Facades\DB;

abstract class Controller
{
    public $indexRouteName = 'messages';
}
