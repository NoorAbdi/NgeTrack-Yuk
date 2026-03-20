<?php

namespace App\Models;

use Illuminate;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Checkpoint extends Model
{
    use HasFactory, SoftDeletes;

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