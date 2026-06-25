<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'カートが空です']);
        }

        $totalPrice = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $order = DB::transaction(function () use ($user, $cartItems, $totalPrice) {

            $order = Order::create([
                'user_id'     => $user->id,
                'total_price' => $totalPrice,
                'ordered_at'  => now(),
            ]);

            foreach ($cartItems as $item) {
                $order->details()->create([
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $item->product->price,
                ]);
            }

            $user->cartItems()->delete();
            return $order;
        });

        return response()->json([
            'message' => '購入が完了しました！カートを空にしました。',
            'order'   => $order->load('details.product')
        ]);
    }
}
