<?php

namespace Database\Seeders;

use App\Models\OrderDetail;
use Illuminate\Database\Seeder;

class OrderDetailSeeder extends Seeder
{
    /**
     * Seed the order_details table.
     */
    public function run(): void
    {
        $orderDetails = [
            [
                'id' => 1,
                'order_id' => 1,
                'product_id' => 2,
                'quantity' => 1,
                'price' => 1200,
            ],
            [
                'id' => 2,
                'order_id' => 1,
                'product_id' => 4,
                'quantity' => 2,
                'price' => 750,
            ],
            [
                'id' => 3,
                'order_id' => 2,
                'product_id' => 3,
                'quantity' => 1,
                'price' => 4800,
            ],
        ];

        foreach ($orderDetails as $orderDetail) {
            OrderDetail::updateOrCreate(
                ['id' => $orderDetail['id']],
                $orderDetail,
            );
        }
    }
}
