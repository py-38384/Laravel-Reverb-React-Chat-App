<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    public function __invoke($image_id){
        $user = auth()->user();
        $image = Image::find($image_id);
        dd($image);
        // if(){

        // }
        return response()->file(storage_path('app/private/' . $path));
    }
}
