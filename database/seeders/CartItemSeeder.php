<?php

namespace Database\Seeders;

use App\Models\CartItem;
use Illuminate\Database\Seeder;

class CartItemSeeder extends Seeder
{
    /**
     * Seed the cart_items table.
     */
    public function run(): void
    {
        $cartItems = [
            [
                'id' => 1,
                'user_id' => 2,
                'product_id' => 2,
                'quantity' => 1,
            ],
            [
                'id' => 2,
                'user_id' => 2,
                'product_id' => 4,
                'quantity' => 2,
            ],
            [
                'id' => 3,
                'user_id' => 3,
                'product_id' => 1,
                'quantity' => 1,
            ],
        ];

        foreach ($cartItems as $cartItem) {
            CartItem::updateOrCreate(
                ['id' => $cartItem['id']],
                $cartItem,
            );
        }
    }
}
