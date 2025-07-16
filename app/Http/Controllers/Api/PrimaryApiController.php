<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PrimaryApiController extends Controller
{
    public function getToken(Request $request){
        logger($request->all());
        return response()->json([
            "status" => "success",
            "Message" => "got the goodis"
        ])->setStatusCode(200);
    }
    public function updateMessageReadStatus(Request $request){
        logger($request->all());
        return response()->json([
            "status" => "success",
            "Message" => "got the ids"
        ])->setStatusCode(200);
    }
}
