<?php

namespace App\Http\Controllers;

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
    public function index() {
        $users = $this->userService->getAllOtherUser();
        return Inertia::render("dashboard",["users" => $users]);
    }
    public function userChat(User $user){
        return Inertia::render('chat',['user' => $user]);
    }
    public function userChat_store(Request $request){
        dd($request->all());
    }
}
