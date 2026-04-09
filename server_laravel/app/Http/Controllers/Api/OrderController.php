<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with('user', 'items.product')->latest()->get());
    }

    public function show(Order $order)
    {
        return response()->json($order->load('user', 'items.product'));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order->update(['status' => $request->status]);

        // Integrate Notification Logic here (WhatsApp/Email)
        // Subscription check would happen here

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    public function dashboardStats()
    {
        $monthlyRevenue = Order::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->where('payment_status', 'paid')
            ->sum('grand_total');

        $activeOrders = Order::whereNotIn('status', ['delivered', 'cancelled'])->count();
        $customRequests = \App\Models\CustomOrder::where('status', 'pending')->count();
        $totalUsers = \App\Models\User::count();

        return response()->json([
            'stats' => [
                ['name' => 'Monthly Sales', 'value' => '₹' . number_format($monthlyRevenue), 'change' => '+12.5%', 'changeType' => 'increase', 'icon' => 'TrendingUp'],
                ['name' => 'Active Orders', 'value' => (string)$activeOrders, 'change' => '+8%', 'changeType' => 'increase', 'icon' => 'ShoppingBag'],
                ['name' => 'Custom Requests', 'value' => (string)$customRequests, 'change' => '+2.4%', 'changeType' => 'increase', 'icon' => 'Scissors'],
                ['name' => 'Registered Users', 'value' => (string)$totalUsers, 'change' => '+15%', 'changeType' => 'increase', 'icon' => 'Users']
            ],
            'recentWork' => \App\Models\CustomOrder::with('user')->latest()->take(3)->get()->map(function($o) {
                return [
                    'id' => $o->id,
                    'customer' => $o->user->name ?? 'Guest',
                    'service' => 'Custom Stitching',
                    'status' => ucfirst($o->status),
                    'image' => '/assets/arrival' . (rand(1,3)) . '.png'
                ];
            }),
            'shipments' => Order::latest()->take(3)->get()->map(function($o) {
                return [
                    'id' => $o->order_number,
                    'product' => 'Order Batch',
                    'amount' => '₹' . number_format($o->grand_total),
                    'status' => ucfirst($o->status)
                ];
            })
        ]);
    }
}
