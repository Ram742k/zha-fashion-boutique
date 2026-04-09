<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmbroideryOrder;
use Illuminate\Http\Request;

class EmbroideryController extends Controller
{
    public function index()
    {
        return response()->json(EmbroideryOrder::with('user')->latest()->get());
    }

    public function updateStatus(Request $request, EmbroideryOrder $order)
    {
        $request->validate(['status' => 'required|string']);
        $order->update(['status' => $request->status]);
        return response()->json($order);
    }
}
