<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\View\View;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Services\Interfaces\UserServiceInterface;

class UserController extends Controller
{
    private $userService;
    public function __construct(UserServiceInterface $userService){
        $this->userService = $userService;
    }
    /**
     * Summary of index
     * function: index
     * Description: Get all the other user and display it to the dashboard. 
     */
    public function messages() {
        // $conversations = auth()->user()->conversations()->with(['users','lastMessage'])->select(['conversations.created_at','conversations.id','type','last_message_id'])->get()->map(function($conversation){
        //     $conversation->lastMessage->created_at_sec = $conversation->lastMessage? round($conversation->lastMessage->created_at->diffInSeconds(now())): '';
        //     return $conversation;
        // });
        $conversations = auth()->user()->conversations()->with(['users','lastMessage'])->select(['conversations.created_at','conversations.id','type','last_message_id'])->get();
        // dd($conversations);
        return Inertia::render("messages",["conversations" => $conversations]);
    }
    public function index() {
        $users = $this->userService->getAllOtherUser();
        return Inertia::render("global",["users" => $users]);
    }
    public function requests(){
        $requests = auth()->user()->receivedFriendships()->where('friendships.status','pending')->select(['users.id','users.name','users.image','users.email','friendships.status','friendships.created_at'])->paginate(10);
        return Inertia::render("requests",["users" => $requests]);
    }
    public function friends(){
        $friendIds = auth()->user()->allFriendIds();
        $friends = User::whereIn('id',$friendIds)->select(['id','name','image','email'])->paginate(10);
        return Inertia::render("friends",["users" => $friends]);
    }

}
