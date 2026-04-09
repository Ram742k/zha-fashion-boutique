<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CustomOrder;
use App\Models\EmbroideryOrder;
use Illuminate\Support\Str;

class BoutiqueSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@zhafashion.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // 2. Create Sample Categories
        $categories = [
            ['name' => 'Lehengas', 'slug' => 'lehengas'],
            ['name' => 'Designer Sarees', 'slug' => 'sarees'],
            ['name' => 'Salwar Sets', 'slug' => 'salwar-sets'],
            ['name' => 'Gowns', 'slug' => 'gowns'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // 3. Create Sample Products
        $lehengaCat = Category::where('slug', 'lehengas')->first();
        Product::create([
            'category_id' => $lehengaCat->id,
            'name' => 'Royal Gold Bridal Lehenga',
            'slug' => 'royal-gold-lehenga',
            'description' => 'A stunning bridal lehenga with heavy gold embroidery.',
            'price' => 45000.00,
            'stock' => 5,
            'images' => ['/assets/designer_lehenga.png'],
            'is_featured' => true,
        ]);

        $gownCat = Category::where('slug', 'gowns')->first();
        Product::create([
            'category_id' => $gownCat->id,
            'name' => 'Draped Chiffon Gown',
            'slug' => 'draped-chiffon-gown',
            'description' => 'Elegant draped gown in blush pink.',
            'price' => 24999.00,
            'stock' => 10,
            'images' => ['/assets/arrival1.png'],
            'is_featured' => true,
        ]);

        // 4. Create Sample Orders
        $order = Order::create([
            'user_id' => $admin->id,
            'order_number' => 'ZF-' . strtoupper(Str::random(6)),
            'total_amount' => 24999.00,
            'discount_amount' => 0,
            'grand_total' => 24999.00,
            'status' => 'processing',
            'payment_status' => 'paid',
            'shipping_address' => ['flat' => '101', 'street' => 'Fashion Ave', 'city' => 'Mumbai'],
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => 2,
            'quantity' => 1,
            'price' => 24999.00,
        ]);

        // 5. Create Sample Custom Orders
        CustomOrder::create([
            'user_id' => $admin->id,
            'order_number' => 'ST-' . strtoupper(Str::random(6)),
            'item_type' => 'Bridal Lehenga',
            'fabric' => 'Raw Silk',
            'measurements' => ['bust' => '34', 'waist' => '28', 'hips' => '38'],
            'status' => 'pending',
            'price_estimate' => 65000.00,
        ]);

        // 6. Create Sample Embroidery Orders
        EmbroideryOrder::create([
            'user_id' => $admin->id,
            'order_number' => 'EMB-' . strtoupper(Str::random(6)),
            'design_image' => '/assets/embroidery_detail.png',
            'fabric_type' => 'Velvet',
            'quantity' => 1,
            'deadline' => now()->addDays(7),
            'status' => 'in_progress',
            'price' => 4500.00,
        ]);
    }
}
