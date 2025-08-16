<?php

namespace App\Observers;

use App\Models\Message;
use Illuminate\Support\Facades\DB;

class MessageObserver
{
    /**
     * Handle the Message "created" event.
     */
    public function created(Message $message): void
    {
        $conversationId = $message->conversation->id;
        $counter = DB::table('message_counter')
        ->where('conversation_id', $conversationId)
        ->first();

        if ($counter) {
            DB::table('message_counter')
                ->where('conversation_id', $conversationId)
                ->increment('message_count');
        } else {
            DB::table('message_counter')->insert([
                'conversation_id' => $conversationId,
                'message_count' => 1,
            ]);
        }
    }

    /**
     * Handle the Message "updated" event.
     */
    public function updated(Message $mes): void
    {
        //
    }

    /**
     * Handle the Message "deleted" event.
     */
    public function deleted(Message $message): void
    {
        DB::table('conversation_counters')
            ->where('conversation_id', $message->conversation_id)
            ->decrement('message_count');
    }

    /**
     * Handle the Message "restored" event.
     */
    public function restored(Message $mes): void
    {
        //
    }

    /**
     * Handle the Message "force deleted" event.
     */
    public function forceDeleted(Message $message): void
    {
        DB::table('conversation_counters')
            ->where('conversation_id', $message->conversation_id)
            ->decrement('message_count');
    }
}
