<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'nis',
        'nisn',
        'gender',
        'birth_date',
        'birth_place',
        'address',
        'father_name',
        'mother_name',
        'religion',
        'nationality',
        'entry_year',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'entry_year' => 'string',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parents()
    {
        return $this->hasMany(ParentProfile::class, 'student_id');
    }
}
