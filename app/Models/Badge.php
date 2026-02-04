<?php

namespace App\Models; 

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Badge extends Model
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
        'description',
        'icon',
    ];

    // -----------------------------------------------------------------
    //  RELASI DATABASE
    // -----------------------------------------------------------------

    /**
     * Mendapatkan semua user yang memiliki lencana ini.
     * Relasi: Many-to-Many
     */
    public function users()
    {
        // Satu Badge 'belongsToMany' (dimiliki oleh banyak) User
        // Kita beritahu Laravel nama tabel pivotnya adalah 'badge_user'
        // dan kita ingin mengambil timestamp 'unlocked_at'
        return $this->belongsToMany(User::class, 'badge_user')
                    ->withTimestamps('unlocked_at');
    }
}