<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Events\SendMessage;
use App\Models\Conversation;
use App\Services\ChatServices;
use App\Http\Requests\ChatRequest;
use Illuminate\Support\Facades\Redirect;

class ChatController extends Controller
{
    private $chatServices;
    public function __construct(ChatServices $chatServices){
        $this->chatServices = $chatServices;
    }
    public function show($chat_id){
        $conversation = Conversation::with('users')->find($chat_id);
        if(!$conversation){
            return redirect()->route('messages');
        }
        $messages = $this->chatServices->getAllMessage($conversation);
        return Inertia::render('chat',['conversation' => $conversation, 'messages' => $messages, 'unReadMessages' => []]);
    }
    public function store(ChatRequest $request){
        $conversation = Conversation::find($request->conversation_id);
        $newMessage = $this->chatServices->create([
            "sender_id" => auth()->id(),
            "conversation_id" => $conversation->id,
            "message" => $request->message, 
        ]);
        if($newMessage){
            $conversation->last_message_id = $newMessage->id;
            $conversation->save();
            broadcast(new SendMessage($newMessage))->toOthers();
            return redirect()->back();
        }
        return redirect()->back()->withErrors([
            'status' => 'error',
            'message' => "Error! Couldn't send the message"
        ]);
    }
    public function chat_start(User $user){
        $current_user = auth()->user();
        $chat = $this->chatServices->getOrCreatePrivateConversation($current_user->id, $user->id);
        if($chat){
            return redirect()->route('chat',[$chat->id]);
        }
        return response()->json(["status" => "error", "message" => "Conversation Not Found. Something Went Wrong!"]);
    }
}
