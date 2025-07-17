<?php

namespace App\Http\Controllers\Api;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ApiAuthRequest;

class PrimaryApiController extends Controller
{
    public function check(){
        return response()->json([
            "status" => "success",
            "message" => "authenticated"
        ])->setStatusCode(200);
    }
    public function get(ApiAuthRequest $request){
        if(!Auth::attempt($request->only('email', 'password'))){
            return response()->json([
                "status" => "faild",
                "Message" => "Credentials Does Not Match!"
            ])->setStatusCode(401);
        }
        $user = User::where('email', $request->email)->first();
        
        return response()->json([
            "status" => "success",
            "Message" => "Authentication Success",
            "user" => $user,
            "token" => $user->createToken('API Token of '.$user->name)->plainTextToken
        ])->setStatusCode(200);
    }
    public function updateMessageReadStatus(Request $request){
        $user = User::find($request->user_id);
        if($user){
            $result = Message::whereIn('id',$request->unread_message_ids)->where('receiver_id', auth()->id())->where('sender_id',$user->id)->update(["is_read" => true]);
            if($result){
                return response()->json([
                    "status" => "success",
                    "Message" => "Message read status update successful"
                ])->setStatusCode(200);
            }
            return response()->json([
                "status" => "error",
                "Message" => "Couldn't update the messages status. Something went wrong!"
            ])->setStatusCode(500);
        }
        return response()->json([
            "status" => "error",
            "Message" => "Couldn't find the user"
        ])->setStatusCode(404);
    }
}
