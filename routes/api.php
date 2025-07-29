<?php

use App\Http\Controllers\Api\PrimaryApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function (){
    Route::post('/token/check', [PrimaryApiController::class, 'check'])->name('check');
    Route::post('/users/search', [PrimaryApiController::class, 'user_search'])->name('user.search');
    Route::post('/update-message-read-status', [PrimaryApiController::class, 'updateMessageReadStatus'])->name('updateMessageReadStatus');
    Route::post('add/request', [PrimaryApiController::class, 'add_requests'])->name('add.requests');
    Route::post('remove/request', [PrimaryApiController::class, 'remove_requests'])->name('remove.requests');
    Route::post('handle/request', [PrimaryApiController::class, 'handle_request'])->name('handle.requests');
});
Route::post('/token/test', [PrimaryApiController::class, 'test'])->name('test');
Route::post('/token/get', [PrimaryApiController::class, 'get'])->name('get.token');