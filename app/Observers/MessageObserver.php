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
        DB::table('message_counter')
            ->updateOrInsert(
                ['conversation_id' => $message->conversation_id],
                ['message_count' => DB::raw('COALESCE(message_count, 0) + 1')]
            );
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
