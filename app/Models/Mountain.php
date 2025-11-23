<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mountain extends Model
{
    use HasFactory;

    /**
     * Atribut yang boleh diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'location',
    ];

    public function hikes()
    {
        return $this->hasMany(Hike::class);
    }

    public function checkpoints()
    {
        return $this->hasMany(Checkpoint::class);
    }
}