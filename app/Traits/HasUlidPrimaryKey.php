<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasUlidPrimaryKey
{
    protected static function bootHasUlidPrimaryKey()
    {
        static::creating(function ($model) {
            if (!$model->getKey()) {
                $model->{$model->getKeyName()} = (string) Str::ulid();
            }
        });
    }
}
