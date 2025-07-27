<?php

use App\Http\Controllers\Api\PrimaryApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/token/test', [PrimaryApiController::class, 'test'])->name('test');
Route::post('/token/check', [PrimaryApiController::class, 'check'])->middleware('auth:sanctum')->name('check');
Route::post('/users/search', [PrimaryApiController::class, 'user_search'])->middleware('auth:sanctum')->name('user.search');
Route::post('/token/get', [PrimaryApiController::class, 'get'])->name('get.token');
Route::post('/update-message-read-status', [PrimaryApiController::class, 'updateMessageReadStatus'])->middleware('auth:sanctum')->name('updateMessageReadStatus');
