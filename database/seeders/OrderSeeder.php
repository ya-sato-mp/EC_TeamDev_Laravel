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
        $orders = [
            [
                'id' => 1,
                'user_id' => 2,
                'total_price' => 2700,
                'ordered_at' => '2026-06-25 10:00:00',
            ],
            [
                'id' => 2,
                'user_id' => 3,
                'total_price' => 4800,
                'ordered_at' => '2026-06-25 15:30:00',
            ],
        ];

        foreach ($orders as $order) {
            Order::updateOrCreate(
                ['id' => $order['id']],
                $order,
            );
        }
    }
}
