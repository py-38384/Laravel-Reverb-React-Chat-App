<?php

namespace App\Http\Controllers;

use App\Events\SendMessage;
use App\Models\User;
use Inertia\Inertia;
use App\Services\ChatServices;
use App\Http\Requests\ChatRequest;
use Request;

class ChatController extends Controller
{
    private $chatServices;
    public function __construct(ChatServices $chatServices){
        $this->chatServices = $chatServices;
    }
    public function show(User $user){
        $messages = $this->chatServices->getAllMessage($user);
        $unReadMessages = $this->chatServices->getUnreadMessage($user);
        return Inertia::render('chat',['user' => $user, 'messages' => $messages, 'unReadMessages' => $unReadMessages]);
    }
    public function store(ChatRequest $request){
        $this->chatServices->create([
            "sender_id" => auth()->id(),
            "receiver_id" => $request->receiver_id,
            "message" => $request->message,
        ]);
        broadcast(new SendMessage())->toOthers();
        return redirect()->back();
    }
}
