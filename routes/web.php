<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('dashboard', [UserController::class, 'index'])->name('dashboard');
        Route::get('chat/{user}', [UserController::class, 'userChat'])->name('chat');
        Route::post('chat/store', [UserController::class, 'userChat_store'])->name('chat.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
