<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomOrder extends Model
{
    protected $fillable = [
        'user_id', 'order_number', 'item_type', 'fabric', 
        'measurements', 'images', 'status', 
        'price_estimate', 'final_price', 'admin_notes'
    ];

    protected $casts = [
        'measurements' => 'array',
        'images' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
