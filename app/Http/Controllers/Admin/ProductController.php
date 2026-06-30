<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Product::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|integer',
            'name'        => 'required|string|max:255',
            'price'       => 'required|integer|min:0',
            'information' => 'nullable|string',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 💡画像チェック
            'is_public'   => 'boolean',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imagePath = $path;
        }

        $product = Product::create([
            'category_id' => $request->category_id,
            'name'        => $request->name,
            'price'       => $request->price,
            'information' => $request->information,
            'stock'       => $request->stock,
            'image'       => $imagePath,
            'is_public'   => $request->is_public ?? true,
        ]);

        return response()->json([
            'message' => '商品を登録しました！',
            'product' => $product
        ],);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(Product::findOrFail($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        $request->validate([
            'category_id' => 'required|integer',
            'name'        => 'required|string|max:255',
            'price'       => 'required|integer|min:0',
            'information' => 'nullable|string',
            'stock'       => 'required|integer|min:0',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 画像チェック
            'is_public'   => 'boolean',
        ]);

        $product->category_id = $request->category_id;
        $product->name        = $request->name;
        $product->price       = $request->price;
        $product->information = $request->information;
        $product->stock       = $request->stock;
        $product->is_public   = $request->is_public ?? true;

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $product->image = $path;
        }

        $product->save();

        return response()->json([
            'message' => '商品を更新しました！',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
    }
}
