<?php

namespace App\Services;

use App\Models\User;
use App\Models\Image;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Repositories\ChatRepository;

class ChatServices
{
    private $chatRepository;
    public function __construct(ChatRepository $chatRepository)
    {
        $this->chatRepository = $chatRepository;
    }
    public function create($data){
        $message = $this->chatRepository->create($data);
        $files = isset(request()->allFiles()['files'])? request()->allFiles()['files']: null;
        if(is_iterable($files) && count($files) > 0){
            foreach($files as $file){
                $mimetype = $file->getMimeType();
                $originalName = $file->getClientOriginalName();
                $file_full_path = $file->store('message/image','storage');

                $message->images()->create([
                    'user_id' => auth()->id(),
                    'original_name' => $originalName,
                    'mime_type' => $mimetype,
                    'full_path' => $file_full_path,
                ]);
            }
        }
        return $message;
    }
    public function getAllMessage($conversation){
        $groupedMessages = [];
        $currentGroup = [];
        $previousSender = null;
        $allMessages =  $this->chatRepository->all($conversation);
        foreach($allMessages as $messages){
            if($previousSender != $messages->sender_id){
                if(!empty($currentGroup)){
                    $groupedMessages[] = $currentGroup;
                    $currentGroup = [];
                }
            }
            $currentGroup[] = $messages;
            $previousSender = $messages->sender_id;
        }
        if(!empty($currentGroup)){
            $groupedMessages[] = $currentGroup;
        }
        return $groupedMessages;
    }
    public function getUnreadMessage($user){
        return $this->chatRepository->getAllUnread(auth()->id(), $user->id);
    }
    public function chat_exist($auth_user_id, $other_user_id){
        return $this->chatRepository->message_exist($auth_user_id, $other_user_id);
    }
    public function getOrCreatePrivateConversation($userAId, $userBId){
        $userIds = [$userAId, $userBId];

        $conversation = Conversation::where('type', 'private')
            ->whereHas('users', function ($q) use ($userAId, $userBId) {
                $q->whereIn('user_id', [$userAId, $userBId]);
            }, '=', 2)
            ->first();
        if($conversation){
            return $conversation;
        }
        return DB::transaction(function () use ($userIds, $userAId, $userBId){
            $friendshipExist = in_array($userBId, User::find($userAId)->allFriendIds()->toArray());
            if($friendshipExist){
                $conversation = Conversation::create([
                    "type" => "private"
                ]);
                $conversation->users()->attach($userIds);
                return $conversation;
            }
            return false;
        });
    }
}
