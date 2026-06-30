<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;

class CartItemController extends Controller
{
    public function index(Request $request)
    {
        return CartItem::with('product')
            ->where('user_id', $request->user()->id)
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => '認証が必要です'], 401);
        }

        $exists = CartItem::where('user_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'この商品はすでにカートに入っています。',
            ], 400);
        }

        $cartItem = CartItem::create([
            'user_id' => $user->id,
            'product_id' => $validated['product_id'],
            'quantity' => $validated['quantity'],
        ]);

        return $cartItem->load('product');
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->update([
            'quantity' => $validated['quantity'],
        ]);

        return $cartItem->load('product');
    }

    public function destroy(Request $request, string $id)
    {
        $cartItem = CartItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->delete();

        return response()->json([
            'message' => 'カートから削除しました',
        ]);
    }
}
