<?php

use App\Http\Controllers\Api\PrimaryApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/api/token/check', [PrimaryApiController::class, 'check'])->middleware('auth:sanctum')->name('check');
Route::post('/api/token/get', [PrimaryApiController::class, 'get'])->middleware('guest')->name('get.token');
Route::post('/update-message-read-status', [PrimaryApiController::class, 'updateMessageReadStatus'])->middleware('auth:sanctum')->name('updateMessageReadStatus');
