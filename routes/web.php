<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\ImageController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('messages', [UserController::class, 'messages'])->name('messages');
    Route::get('chat/{user}', [ChatController::class, 'show'])->name('chat');
    Route::post('chat/store', [ChatController::class, 'store'])->name('chat.store');
    Route::post('/messages/mark-read', [ChatController::class, 'mark_read'])->name('chat.mark_read');

    Route::get('global', [UserController::class, 'index'])->name('global');
});
Route::get('message/image/{image_id}',ImageController::class);


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
