<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('category')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image_file' => 'nullable|image|max:2048',
            'is_featured' => 'boolean'
        ]);

        $validated['slug'] = Str::slug($request->name) . '-' . time();
        
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('products', 'public');
            $validated['images'] = [asset('storage/' . $path)];
        }
        
        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'variants']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'image_file' => 'nullable|image|max:2048',
            'is_featured' => 'boolean',
            'status' => 'boolean'
        ]);

        if ($request->has('name') && $request->name != $product->name) {
            $validated['slug'] = Str::slug($request->name) . '-' . time();
        }

        if ($request->hasFile('image_file')) {
            // Delete old images
            if ($product->images) {
                foreach ($product->images as $url) {
                    $oldPath = str_replace(asset('storage/'), '', $url);
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $path = $request->file('image_file')->store('products', 'public');
            $validated['images'] = [asset('storage/' . $path)];
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    public function destroy(Product $product)
    {
        if ($product->images) {
            foreach ($product->images as $url) {
                $oldPath = str_replace(asset('storage/'), '', $url);
                Storage::disk('public')->delete($oldPath);
            }
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function exportCsv()
    {
        $products = Product::with('category')->get();
        $csvFileName = 'products_export_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['Name', 'Price', 'Category', 'Stock', 'Created Date'];

        $callback = function() use($products, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($products as $product) {
                fputcsv($file, [
                    $product->name,
                    $product->price,
                    $product->category ? $product->category->name : 'N/A',
                    $product->stock,
                    $product->created_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
