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
    public function conversations(){
        return self::belongsToMany(Conversation::class, "conversation_user",'conversation_id','user_id');
    }
    public function receivedFriendships(){
        return self::belongsToMany(User::class, 'friendships','requester_id','addressee_id');
    }
    public function sentFriendships(){
        return self::belongsToMany(User::class, 'friendships','addressee_id','requester_id');
    }
    public function allFriends()
    {
        $sent = $this->sentFriendships()->where('status', 'accepted')->pluck('addressee_id');
        $received = $this->receivedFriendships()->where('status', 'accepted')->pluck('requester_id');
        return User::whereIn('id', $sent->merge($received))->get();
    }
}
