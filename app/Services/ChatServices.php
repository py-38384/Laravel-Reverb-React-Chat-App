<?php

namespace App\Services;

use App\Models\Image;
use Illuminate\Http\Request;
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

                $message->images()::create([
                    'user_id' => auth()->id(),
                    'original_name' => $originalName,
                    'mime_type' => $mimetype,
                    'full_path' => $file_full_path,
                ]);
            }
        }
        return $this->chatRepository->create($data);
    }
    public function getAllMessage($user){
        $groupedMessages = [];
        $currentGroup = [];
        $previousSender = null;
        $allMessages =  $this->chatRepository->all(auth()->id(), $user->id);
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
}
