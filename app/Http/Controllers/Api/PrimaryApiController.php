<?php 

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Message;
use App\Models\Friendship;
use App\Events\MessageSeen;
use App\Models\Conversation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use App\Services\ChatServices;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Repositories\ChatRepository;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ApiAuthRequest;
use Laravel\Pail\ValueObjects\Origin\Console;

class PrimaryApiController extends Controller
{
    private $chatServices;
    public function __construct(ChatServices $chatServices){
        $this->chatServices = $chatServices;
    }
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
        $authId = auth()->id();
        $users = User::whereKeyNot($authId) // exclude self
                ->whereDoesntHave('receivedFriendships', function ($q) use ($authId) {
                    $q->where('requester_id', $authId);
                })
                ->whereDoesntHave('sentFriendships', function ($q) use ($authId) {
                    $q->where('addressee_id', $authId);
                })
                ->where(function ($q) use ($searchQuery) {
                    $q->where('name', 'ilike', "%$searchQuery%")
                    ->orWhere('email', 'ilike', "%$searchQuery%");
                })
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
        $friendship_exist_from_there_end = Friendship::where('requester_id', $other_user_id)->where('addressee_id', $current_user->id)->where('status', 'pending')->first();
        
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
    public function messages(Request $request){
        $conversationId = $request->conversationId;
        $conversation = Conversation::with("users")->find($conversationId);
        if(!$conversation->users->contains("id", auth()->id())){
            abort(404);
        }
        $offsetAmount = $request->offsetAmount;
        $messageCount = Message::where('conversation_id', $conversation->id)->count();
        if(($offsetAmount * config('constant.messageLimitPerPage')) > $messageCount){
            return  ["status" => "faild", "message" => "No More Message Found"];
        }
        $messages = $this->chatServices->getMessage($conversation, $offsetAmount);
        return  ["status" => "success", "message" => "Message Sucessfully Fetched", "data" => $messages];
    }
    public function block_request(Request $request){
        $request->validate([
            'id' => ['required', 'string', 'exists:users,id']
        ]);
        $other_user_id = $request->id;
        $current_user = auth()->user();
        $blocked_from_my_end = Friendship::where('requester_id', $current_user->id)->where('addressee_id', $other_user_id)->first();
        $blocked_from_there_end = Friendship::where('requester_id', $other_user_id)->where('addressee_id', $current_user->id)->first();

        if($blocked_from_my_end || $blocked_from_there_end){
            if($blocked_from_my_end->status == 'blocked' || $blocked_from_there_end == 'blocked'){
                return [
                    'status' => 'success',
                    'message' => 'Already Blocked',
                ];
            }
            if($blocked_from_my_end){
                $blocked_from_my_end->status = 'blocked';
                $blocked_from_my_end->save();
            }
            if($blocked_from_there_end){
                $blocked_from_there_end->status = 'blocked';
                $blocked_from_there_end->save();
            }
            return [
                'status' => 'success',
                'message' => 'status change to blocked'
            ];
        } 
        $current_user->sentFriendships()->attach($other_user_id, ['status' => 'blocked']);
        return [
            'status' => 'success',
            'message' => 'status change to blocked'
        ];
    }
    public function unblock_request(Request $request){
        $request->validate([
            'id' => ['required', 'string', 'exists:users,id']
        ]);
        $other_user_id = $request->id;
        $current_user = auth()->user();
        $blocked_from_my_end = Friendship::where('requester_id', $current_user->id)->where('addressee_id', $other_user_id)->first();
        if(!$blocked_from_my_end){
            return [
                'status' => 'faild',
                'message' => 'No Relation Found',
            ];
        }
        $blocked_from_my_end->delete();
        return [
            'status' => 'success',
            'message' => 'You Unblocked The OherUser',
        ];
    }
    public function user_global(Request $request){
        $request->validate([
            'offsetAmount' => ['required','numeric']
        ]);
        $data = User::whereKeyNot(auth()->id())
        ->whereDoesntHave('receivedFriendships', function ($q) {
            $q->where('requester_id', auth()->id());
        })
        ->whereDoesntHave('sentFriendships', function ($q) {
            $q->where('addressee_id', auth()->id());
        })
            ->orderBy('created_at')
            ->offset(config('constant.pagination')*$request->offsetAmount)
            ->limit(config('constant.pagination'))
            ->get()
            ->toArray();
        return ['status' => 'success','data' => $data];
    }
    public function user_friend(Request $request){
        $request->validate([
            'offsetAmount' => ['required','numeric']
        ]);
        $friendIds = auth()->user()->allFriendIds();
        $data = User::whereIn('id',$friendIds)
            ->select(['id','name','image','email'])
            ->orderBy('created_at')
            ->offset(config('constant.pagination')*$request->offsetAmount)
            ->limit(config('constant.pagination'))
            ->get()
            ->toArray();
        return ['status' => 'success','data' => $data];
    }
    public function user_unfriend(Request $request){
        $request->validate([
            'id' => ['required','exists:users,id']
        ]);

        $user1 = auth()->id();
        $user2 = $request->id;

        $private_conversation = Conversation::with('messages.images')->where('type','private')
        ->whereHas('users', function ($query) use ($request, $user1){
            $query->where('user_id',$user1);
        })
        ->whereHas('users', function ($query) use ($user2) {
            $query->where('user_id',$user2);
        })
        ->first();

        if($private_conversation){
            $this->chatServices->delete_converstion_and_all_related_data($private_conversation);
        }

        $friendShip = Friendship::whereIn('requester_id',[$user1, $user2])->whereIn('addressee_id',[$user1, $user2])->first();
        if(!$friendShip){
            return [
                "status" => "unsuccessful",
                "message" => "Friendship Not Found Between You Too",
            ];
        }
        $friendShip->delete();
        return [
            "status" => "success",
            "message" => "Unfriend Successfull And Conversation Message Message Files All Removed",
        ];

    }
    public function conversation_delete(Request $request){
        $request->validate([
            'id' => ['required','exists:conversations,id']
        ]);
        $private_conversation = Conversation::find($request->id);
        if(!$private_conversation->users()->where('user_id', auth()->id())->exists()){
            return response([
                "status" => "error",
                "message" => "Unauthorize Oparation"
            ],401);
        }
        $success = $this->chatServices->delete_conversation_and_all_related_data($private_conversation);
        if($success){
            return [
                "status" => "success",
                "message" => "Conversation Successfully Deleted"
            ];
        }
        return [
            "status" => "error",
            "message" => "Something Went Wrong"
        ];
    }
}
