<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function show(Order $order)
    {
        $order->load(['user', 'items.product']);
        
        $data = [
            'order' => $order,
            'date' => now()->format('d M Y'),
        ];

        return view('invoices.order_invoice', $data);
    }
}
