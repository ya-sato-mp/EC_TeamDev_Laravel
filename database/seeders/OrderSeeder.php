<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Seed the orders table.
     */
    public function run(): void
    {
        foreach (SeedData::orders() as $order) {
            Order::updateOrCreate(
                ['id' => $order['id']],
                $order,
            );
        }
    }
}
