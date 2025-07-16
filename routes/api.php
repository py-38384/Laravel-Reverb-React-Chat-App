<?php

use App\Http\Controllers\Api\PrimaryApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/get-token', [PrimaryApiController::class, 'getToken'])->middleware('guest')->name('get.token');
Route::post('/update-message-read-status', [PrimaryApiController::class, 'updateMessageReadStatus'])->middleware('auth:sanctum')->name('updateMessageReadStatus');
