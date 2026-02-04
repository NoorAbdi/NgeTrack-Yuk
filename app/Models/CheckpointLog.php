<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckpointLog extends Model
{
    use HasFactory;

    /**
     * Atribut yang boleh diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'hike_id',
        'checkpoint_id',
        'direction',
        'scanned_at',
    ];

    /**
     * Memberitahu Laravel untuk TIDAK mengelola kolom 'created_at' dan 'updated_at'.
     * Kita nonaktifkan karena kita hanya peduli pada 'scanned_at'.
     *
     * @var bool
     */
    public $timestamps = false;

    public function hike()
    {
        return $this->belongsTo(Hike::class);
    }

    public function checkpoint()
    {
        return $this->belongsTo(Checkpoint::class);
    }
}