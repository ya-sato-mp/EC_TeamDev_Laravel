<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

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

        $order = DB::transaction(function () use ($request, $cartItems) {
            $totalPrice = 0;
            $products = [];

            foreach ($cartItems as $cartItem) {
                $product = Product::lockForUpdate()->findOrFail($cartItem->product_id);

                if ($product->stock < $cartItem->quantity) {
                    throw new HttpResponseException(response()->json([
                        'message' => "{$product->name} の在庫が不足しています",
                    ], 400));
                }

                $products[$cartItem->product_id] = $product;
                $totalPrice += $product->price * $cartItem->quantity;
            }

            $order = Order::create([
                'user_id' => $request->user_id,
                'total_price' => $totalPrice,
                'ordered_at' => now(),
            ]);

            foreach ($cartItems as $cartItem) {
                $product = $products[$cartItem->product_id];

                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $cartItem->quantity,
                    'price' => $product->price,
                ]);

                $product->decrement('stock', $cartItem->quantity);
            }

            CartItem::where('user_id', $request->user_id)->delete();

            return $order;
        });

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
