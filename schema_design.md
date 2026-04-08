# Database Schema - Zha Fashion

## Tables

### 1. `users`
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String)
- `phone` (String, Nullable)
- `role` (Enum: 'admin', 'customer')
- `address` (Text, Nullable)
- `city` (String, Nullable)
- `pincode` (String, Nullable)
- `remember_token` (String)
- `timestamps`

### 2. `categories`
- `id` (PK)
- `name` (String)
- `slug` (String, Unique)
- `image` (String, Nullable)
- `description` (Text, Nullable)
- `timestamps`

### 3. `products`
- `id` (PK)
- `category_id` (FK -> categories)
- `name` (String)
- `slug` (String, Unique)
- `description` (LongText)
- `price` (Decimal, 10,2)
- `sale_price` (Decimal, 10,2, Nullable)
- `stock` (Integer)
- `images` (JSON) - Array of image paths
- `variants` (JSON) - e.g., `{"sizes": ["S", "M", "L"], "colors": ["Red", "Gold"]}`
- `is_featured` (Boolean, Default: false)
- `status` (Boolean, Default: true)
- `timestamps`

### 4. `coupons`
- `id` (PK)
- `code` (String, Unique)
- `type` (Enum: 'fixed', 'percent')
- `value` (Decimal)
- `min_order_amount` (Decimal, Default: 0)
- `expiry_date` (Date)
- `status` (Boolean, Default: true)
- `timestamps`

### 5. `orders`
- `id` (PK)
- `user_id` (FK -> users)
- `order_number` (String, Unique)
- `total_amount` (Decimal)
- `discount_amount` (Decimal, Default: 0)
- `tax_amount` (Decimal, Default: 0)
- `shipping_amount` (Decimal, Default: 0)
- `grand_total` (Decimal)
- `status` (Enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- `payment_method` (Enum: 'razorpay', 'cod')
- `payment_status` (Enum: 'pending', 'paid', 'failed')
- `razorpay_order_id` (String, Nullable)
- `razorpay_payment_id` (String, Nullable)
- `shipping_address` (JSON) - Snapshot of address at time of order
- `notes` (Text, Nullable)
- `timestamps`

### 6. `order_items`
- `id` (PK)
- `order_id` (FK -> orders)
- `product_id` (FK -> products)
- `quantity` (Integer)
- `price` (Decimal)
- `variant` (JSON, Nullable) - e.g., `{"size": "M", "color": "Gold"}`
- `timestamps`

### 7. `custom_orders`
- `id` (PK)
- `user_id` (FK -> users)
- `order_number` (String, Unique)
- `status` (Enum: 'pending', 'approved', 'rejected', 'in_progress', 'completed')
- `fabric_selection` (String)
- `item_type` (String) - e.g., 'Salwar', 'Lehenga'
- `measurements` (JSON) - Keys like: bust, waist, length, etc.
- `design_image` (String, Nullable)
- `notes` (Text, Nullable)
- `price_estimate` (Decimal, Nullable)
- `final_price` (Decimal, Nullable)
- `payment_status` (Enum: 'pending', 'paid', 'failed')
- `timestamps`

### 8. `embroidery_orders`
- `id` (PK)
- `user_id` (FK -> users)
- `order_number` (String, Unique)
- `status` (Enum: 'pending', 'processing', 'completed')
- `design_upload` (String) - Path to image
- `fabric_type` (String)
- `quantity` (Integer)
- `deadline` (Date)
- `estimated_price` (Decimal, Nullable)
- `final_price` (Decimal, Nullable)
- `notes` (Text, Nullable)
- `timestamps`

### 9. `reviews`
- `id` (PK)
- `user_id` (FK -> users)
- `product_id` (FK -> products)
- `rating` (Integer, 1-5)
- `comment` (Text)
- `status` (Boolean, Default: true)
- `timestamps`

### 10. `wishlist`
- `id` (PK)
- `user_id` (FK -> users)
- `product_id` (FK -> products)
- `timestamps`

## Relationships
- Category has many Products.
- Product has many Order Items.
- Order has many Order Items.
- User has many Orders, Wishlist, Reviews.
- User has many Custom Orders and Embroidery Orders.
