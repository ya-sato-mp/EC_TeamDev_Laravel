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
        foreach (SeedData::cartItems() as $cartItem) {
            CartItem::updateOrCreate(
                ['id' => $cartItem['id']],
                $cartItem,
            );
        }
    }
}
