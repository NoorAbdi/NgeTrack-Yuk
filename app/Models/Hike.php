<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hike extends Model
{
    protected $fillable = [
        'hike_registration_id', 
        'user_id', 
        'mountain_id', 
        'status', 
        'planned_ascent_date', 
        'planned_descent_date', 
        'completed_at',
        'terms_accepted_at',
        'admin_notes',
    ];

    protected $casts = [
        'planned_ascent_date' => 'datetime',
        'planned_descent_date' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function mountain()
    {
        return $this->belongsTo(Mountain::class);
    }
    
    public function logs()
    {
        return $this->hasMany(CheckpointLog::class);
    }
    
    public function lastLog()
    {
        return $this->hasOne(CheckpointLog::class)->latestOfMany('scanned_at');
    }

    public function badgesEarned()
    {
    return $this->belongsToMany(Badge::class, 'badge_user')
                ->withPivot('unlocked_at')
                ->withTimestamps();
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'hike_members', 'hike_id', 'user_id')
                    ->withTimestamps();
    }
}