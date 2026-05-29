<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Campos que podem ser preenchidos via mass assignment
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
    ];

    // Converte tipos automaticamente
    protected $casts = [
        'due_date' => 'date',
    ];

    // Relacionamento: cada Task pertence a um User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}