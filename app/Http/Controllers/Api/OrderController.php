<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\CartItem;
use App\Models\Product;

class OrderController extends Controller
{
    public function index()
    {
        return Order::all();
    }

    public function store(Request $request)
    {
        $cartItems = CartItem::where('user_id', $request->user_id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'カートに商品がありません',
            ], 400);
        }

        $totalPrice = 0;

        foreach ($cartItems as $cartItem) {
            $product = Product::findOrFail($cartItem->product_id);
            $totalPrice += $product->price * $cartItem->quantity;
        }

        $order = Order::create([
            'user_id' => $request->user_id,
            'total_price' => $totalPrice,
            'ordered_at' => now(),
        ]);

        foreach ($cartItems as $cartItem) {
            $product = Product::findOrFail($cartItem->product_id);

            OrderDetail::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $cartItem->quantity,
                'price' => $product->price,
            ]);
        }

        CartItem::where('user_id', $request->user_id)->delete();

        return response()->json($order, 201);
    }

    public function show(string $id)
    {
        return Order::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
