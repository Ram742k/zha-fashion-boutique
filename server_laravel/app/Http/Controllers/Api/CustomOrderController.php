<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomOrder;
use Illuminate\Http\Request;

class CustomOrderController extends Controller
{
    public function index()
    {
        return response()->json(CustomOrder::with('user')->latest()->get());
    }

    public function updateQuotation(Request $request, CustomOrder $order)
    {
        $validated = $request->validate([
            'price_estimate' => 'required|numeric'
        ]);

        $order->update($validated);
        return response()->json($order);
    }

    public function updateStatus(Request $request, CustomOrder $order)
    {
        $request->validate(['status' => 'required|string']);
        $order->update(['status' => $request->status]);
        return response()->json($order);
    }
}
