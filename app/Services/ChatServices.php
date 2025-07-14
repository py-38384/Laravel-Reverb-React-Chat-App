<?php

namespace App\Services;

use App\Repositories\ChatRepository;

class ChatServices
{
    private $chatRepository;
    public function __construct(ChatRepository $chatRepository)
    {
        $this->chatRepository = $chatRepository;
    }
    public function create($data){
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
}
