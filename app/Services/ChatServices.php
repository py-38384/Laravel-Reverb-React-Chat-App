<?php

namespace App\Services;

use App\Models\User;
use App\Models\Image;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Repositories\ChatRepository;
use App\Services\Interfaces\ChatServiceInterface;

class ChatServices implements ChatServiceInterface
{
    private $chatRepository;
    public function __construct(ChatRepository $chatRepository)
    {
        $this->chatRepository = $chatRepository;
    }
    public function create($data)
    {
        DB::beginTransaction();
        try {
            $message = $this->chatRepository->create($data);
            $files = isset(request()->allFiles()['files']) ? request()->allFiles()['files'] : null;
            if (is_iterable($files) && count($files) > 0) {
                foreach ($files as $file) {
                    $mimetype = $file->getMimeType();
                    $originalName = $file->getClientOriginalName();
                    $file_full_path = $file->store('message/image', 'storage');

                    $message->images()->create([
                        'user_id' => auth()->id(),
                        'original_name' => $originalName,
                        'mime_type' => $mimetype,
                        'full_path' => $file_full_path,
                    ]);
                }
            }
            DB::commit();
            return $message;
        } catch (\Throwable $th) {
            logger()->error($th->getMessage());
            DB::rollBack();
            return false;
        }

    }
    public function getMessage($conversation, $offsetAmount = 0)
    {
        $groupedMessages = [];
        $currentGroup = [];
        $previousSender = null;
        $allMessages = $this->chatRepository->get($conversation, $offsetAmount);
        foreach ($allMessages as $messages) {
            if ($previousSender != $messages->sender_id) {
                if (!empty($currentGroup)) {
                    $groupedMessages[] = $currentGroup;
                    $currentGroup = [];
                }
            }
            $currentGroup[] = $messages;
            $previousSender = $messages->sender_id;
        }
        if (!empty($currentGroup)) {
            $groupedMessages[] = $currentGroup;
        }
        return $groupedMessages;
    }
    public function getUnreadMessage($user)
    {
        return $this->chatRepository->getAllUnread(auth()->id(), $user->id);
    }
    public function chat_exist($auth_user_id, $other_user_id)
    {
        return $this->chatRepository->message_exist($auth_user_id, $other_user_id);
    }
    public function getOrCreatePrivateConversation($userAId, $userBId)
    {
        $userIds = [$userAId, $userBId];

        $conversation = Conversation::where('type', 'private')
            ->whereHas('users', function ($q) use ($userAId, $userBId) {
                $q->whereIn('user_id', [$userAId, $userBId]);
            }, '=', 2)
            ->first();
        if ($conversation) {
            return $conversation;
        }
        return DB::transaction(function () use ($userIds, $userAId, $userBId) {
            $friendshipExist = in_array($userBId, User::find($userAId)->allFriendIds()->toArray());
            if ($friendshipExist) {
                $conversation = Conversation::create([
                    "type" => "private"
                ]);
                $conversation->users()->attach($userIds);
                return $conversation;
            }
            return false;
        });
    }
    public function delete_conversation_and_all_related_data($private_conversation)
    {
        $messages = $private_conversation->messages ?? [];
        $messagesIdsArray = [];
        $tempPaths = [];

        try {
            foreach ($messages as $message) {
                if ($message instanceof Message) {
                    foreach ($message->images as $image) {
                        $filePath = storage_path($image->full_path);
                        if (file_exists($filePath)) {
                            $trashPath = storage_path('app/trash/' . uniqid() . '_' . basename($filePath));

                            if (!is_dir(dirname($trashPath))) {
                                mkdir(dirname($trashPath), 0777, true);
                            }

                            if (rename($filePath, $trashPath)) {
                                $tempPaths[] = [$trashPath, $filePath];
                            } else {
                                throw new \Exception("Failed to move file to trash: {$filePath}");
                            }
                        }
                    }
                    $messagesIdsArray[] = $message->id;
                }
            }

            DB::beginTransaction();
            DB::table('message_counter')->where('conversation_id', $private_conversation->id)->delete();
            $private_conversation->delete();

            if (!empty($messagesIdsArray)) {
                Message::whereIn('id', $messagesIdsArray)->delete();
            }

            DB::commit();

            foreach ($tempPaths as [$trashPath, $original]) {
                @unlink($trashPath);
            }

            return true;

        } catch (\Throwable $th) {
            DB::rollBack();

            foreach ($tempPaths as [$trashPath, $original]) {
                if (file_exists($trashPath)) {
                    if (!is_dir(dirname($original))) {
                        mkdir(dirname($original), 0777, true);
                    }
                    rename($trashPath, $original);
                }
            }

            logger()->error('When Trying To Delete Conversation + Related Data Got An Error -> ' . $th->getMessage());
            return false;
        }
    }

}
