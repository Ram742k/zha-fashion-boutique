<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmbroideryOrder extends Model
{
    protected $fillable = [
        'user_id', 'order_number', 'design_image', 
        'fabric_type', 'quantity', 'deadline', 
        'status', 'price'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
