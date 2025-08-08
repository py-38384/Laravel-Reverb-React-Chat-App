<?php 

namespace App\Http\Controllers\Api;

use App\Events\MessageSeen;
use App\Models\Message;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ApiAuthRequest;
use Laravel\Pail\ValueObjects\Origin\Console;

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
        if(!$request->unread_message_ids){
            abort(404);
        }
        $unReadMessages = Message::with('message_seen')->whereIn('id',$request->unread_message_ids)->get();
        $conversation = $unReadMessages[0]->conversation;
        $isUpdatedMessageSeen = false;
        foreach($unReadMessages as $unReadMessage){
            if(!$unReadMessage->message_seen->contains('id',auth()->id())){
                $unReadMessage->message_seen()->attach(auth()->user());
                $isUpdatedMessageSeen = true;
            }
        }
        if($isUpdatedMessageSeen){
            $unReadMessages = Message::with('message_seen')->whereIn('id',$request->unread_message_ids)->get();
            broadcast(new MessageSeen($conversation, $unReadMessages))->toOthers();
        }
        return [
            "status" => "success",
            "message" => "Messages Successfully Seen"
        ];
    }
    public function user_search(Request $request){
        $request->validate([
            "q" => "required",
        ]);
        $searchQuery = $request->q;
        $users = User::where('name','ilike',"%$searchQuery%")
                ->orWhere('email', 'ilike', "%$searchQuery%")
                ->get()->toArray();
        return $users;
    }
    public function add_requests(Request $request){
        $request->validate([
            'id' => ['required', 'string', 'exists:users,id']
        ]);
        $other_user_id = $request->id;
        $current_user = auth()->user();
        $friendship_exist_from_my_end = Friendship::where('requester_id', $current_user->id)->where('addressee_id', $other_user_id)->exists();
        $friendship_exist_from_there_end = Friendship::where('requester_id', $other_user_id)->where('addressee_id', $current_user->id)->exists();

        if($friendship_exist_from_my_end || $friendship_exist_from_there_end){
            return [
                'status' => 'failed',
                'message' => 'Already Friendship or FriendRequest exist',
            ];
        } 
        $current_user->sentFriendships()->attach($other_user_id, ['status' => 'pending']);
        return [
            'status' => 'success',
            'message' => 'Friend Request Send',
        ];
    }
    public function remove_requests(Request $request){
        $request->validate([
            'id' => ['required', 'string', 'exists:users,id']
        ]);
        $other_user_id = $request->id;
        $current_user = auth()->user();
        $friendship_exist_from_my_end = Friendship::where('requester_id', $current_user->id)->where('addressee_id', $other_user_id)->where('status', 'pending')->exists();

        if($friendship_exist_from_my_end){
            $current_user->sentFriendships()->detach($other_user_id);
            return [
                'status' => 'success',
                'message' => 'Friend request cancel',
            ];
        } 
        return [
            'status' => 'failed',
            'message' => 'Friend request does not exist',
        ];
    }
    public function handle_request(Request $request){
        $request->validate([
            'id' => ['required', 'string', 'exists:users,id'],
            'oparation' => ['required', 'string'],
        ]);
        $other_user_id = $request->id;
        $current_user = auth()->user();
        // dump($other_user_id);
        // dd($current_user);
        $friendship_exist_from_there_end = Friendship::where('requester_id', $other_user_id)->where('addressee_id', $current_user->id)->where('status', 'pending')->first();
        // $friendship_exist_from_there_end = Friendship::where('requester_id', $other_user_id)->where('addressee_id', $current_user)->where('status', 'pending')->first();
        // dd($friendship_exist_from_there_end);
        
        if($friendship_exist_from_there_end){
            if($request->oparation == 'accept'){
                $friendship_exist_from_there_end->status = 'accepted';
                $friendship_exist_from_there_end->save();
                return [
                    'status' => 'success',
                    'message' => 'Friend request acception successfull',
                ];
            }
            if($request->oparation == 'reject'){
                $current_user->receivedFriendships()->detach($other_user_id);
                return [
                    'status' => 'success',
                    'message' => 'Friend request reejected successfull',
                ];
            }
        } 
        return [
            'status' => 'failed',
            'message' => 'Friend request does not exist',
        ];
    }
}
