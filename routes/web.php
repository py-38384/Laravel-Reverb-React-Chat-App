<?php

use App\Http\Controllers\ChatController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [UserController::class, 'index'])->name('dashboard');
    Route::get('chat/{user}', [ChatController::class, 'show'])->name('chat');
    Route::post('chat/store', [ChatController::class, 'store'])->name('chat.store');
    Route::post('/messages/mark-read', [ChatController::class, 'mark_read'])->name('chat.mark_read');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
