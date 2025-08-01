<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Services\ChatServices;
use App\Models\Image as ImageModel;
use Intervention\Image\ImageManager;
use Intervention\Image\Facades\Image;

class ImageController extends Controller
{
    private $chat_services;
    public function __construct(ChatServices $chat_services){
        $this->chat_services = $chat_services;
    }
    public function __invoke($image_id){
        try {
            $user = auth()->user();
            if(!$user){
                abort(404);
            }
            $preview = request()->query('preview');
            $image = ImageModel::with('message')->find($image_id);
            if($image->message){
                $conversation = $image->message->conversation;
                if($conversation->users->contains('id',$user->id)){
                    if($preview){
                        $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver);
                        $image_compressed = $manager->read(storage_path($image->full_path))
                        ->scaleDown(width: 400)
                        ->toJpeg(50);
                        return response($image_compressed, 200)->header('Content-Type', 'image/jpeg');
                    }
                    return response()->file(storage_path($image->full_path));
                }
                abort(404);
            }
            return response()->file(storage_path($image->full_path));
        } catch (\Throwable $th) {
            logger($th->getMessage());
            abort(404);
        }
    }
}
