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
            //code...
            $user = auth()->user();
            if(!$user){
                abort(404);
            }
            $preview = request()->query('preview');
            $image = ImageModel::find($image_id);
    
            $auth_user_id = $user->id;
            $other_user_id = $image->user_id;
            $message_exist = $this->chat_services->chat_exist($auth_user_id, $other_user_id);
            if($image->user_id == $user->id || $message_exist){
                if($preview){
                    $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver); // or Imagick
                    $image_compressed = $manager->read(storage_path($image->full_path))
                                    ->scaleDown(width: 400)
                                    ->toJpeg(50);
                    return response($image_compressed, 200)->header('Content-Type', 'image/jpeg');
                }
                return response()->file(storage_path($image->full_path));
            }
            abort(404);
        } catch (\Throwable $th) {
            logger($th->getMessage());
            abort(404);
        }
    }
}
