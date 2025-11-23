<?php

namespace App\Models;

use Illuminate;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checkpoint extends Model
{
    use HasFactory;

    /**
     * Atribut yang boleh diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'mountain_id',
        'name',
        'slug',
        'order', 
    ];

    public function mountain()
    {
        return $this->belongsTo(Mountain::class);
    }

    public function logs()
    {
        return $this->hasMany(CheckpointLog::class);
    }
}