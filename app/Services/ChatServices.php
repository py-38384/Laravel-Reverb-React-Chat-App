<?php

namespace App\Services;

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
        $files = request()->allFiles()['files'];
        $files_json = null;
        if(is_iterable($files) && count($files) > 0){
            $files_json = [];
            foreach($files as $file){
                $mimetype = $file->getMimeType();
                $originalName = $file->getClientOriginalName();
                $file_full_path = $file->store('message/image','storage');
                $files_json[] = ['minetype' => $mimetype, 'originalName' => $originalName, 'file_full_path' => $file_full_path];
            }
            $data['files'] = json_encode($files_json);
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
}
