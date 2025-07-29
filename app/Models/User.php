<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Conversation;
use App\Traits\HasUlidPrimaryKey;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasUlidPrimaryKey, HasApiTokens;

    protected $table = "users";
    public $incrementing = false;
    public $keyType = "string";
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function conversations()
    {
        return self::belongsToMany(Conversation::class, "conversation_user", 'conversation_id', 'user_id');
    }
    public function receivedFriendships()
    {
        return self::belongsToMany(User::class, 'friendships', 'addressee_id', 'requester_id')->withPivot('status', 'created_at')->withTimestamps();
    }
    public function sentFriendships()
    {
        return self::belongsToMany(User::class, 'friendships', 'requester_id', 'addressee_id')->withTimestamps();
    }
    public function allFriendIds()
    {
        $authId = auth()->id();
        return Friendship::where('status', 'accepted')
            ->where(function ($q) use ($authId) {
                $q->where('requester_id', $authId)
                    ->orWhere('addressee_id', $authId);
            })
            ->get()
            ->map(function ($friendship) use ($authId) {
                // Return the opposite user (the friend)
                return $friendship->requester_id == $authId
                    ? $friendship->addressee_id
                    : $friendship->requester_id;
            })
            ->unique()
            ->values();
    }
}
