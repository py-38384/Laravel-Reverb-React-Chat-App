<?php

namespace App\Models;

use App\Traits\HasUlidPrimaryKey;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasUlidPrimaryKey;
    public $incrementing = false;
    public $keyType = "string";
    protected $guarded = ['id','created_at','updated_at'];
}
