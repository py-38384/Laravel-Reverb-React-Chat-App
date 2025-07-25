<?php

namespace App\Http\Controllers;

use App\Events\SendMessage;
use App\Models\Conversation;
use App\Models\User;
use Inertia\Inertia;
use App\Services\ChatServices;
use App\Http\Requests\ChatRequest;

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
        $conversation = null;
        if(!$request->conversation_id){
            $sender_id = auth()->id();
            $receiver_id = $request->receiver_id;
            $conversation = Conversation::where('type','private')
                        ->whereHas('users', function ($query) use ($sender_id){
                            $query->where('user_id',$sender_id);
                        })
                        ->whereHas('users', function ($query) use ($receiver_id){
                            $query->where('user_id', $receiver_id);
                        })->first();
            if(!$conversation){
                $conversation = new Conversation();
                $conversation->users()->sync([$sender_id, $receiver_id]);
            }
        } else {
            $conversation = Conversation::find($request->conversation_id);
        }
        $newMessage = $this->chatServices->create([
            "sender_id" => auth()->id(),
            "conversation_id" => $conversation->id,
            "message" => $request->message, 
        ]);
        
        broadcast(new SendMessage($newMessage))->toOthers();
        return redirect()->back();
    }
}
