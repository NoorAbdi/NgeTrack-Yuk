<?php

namespace App;

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
}