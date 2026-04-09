<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'order_number', 'total_amount', 
        'discount_amount', 'grand_total', 'status', 
        'payment_method', 'payment_status', 
        'razorpay_order_id', 'razorpay_payment_id', 
        'shipping_address', 'notes'
    ];

    protected $casts = [
        'shipping_address' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
