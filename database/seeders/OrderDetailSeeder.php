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
        foreach (SeedData::orderDetails() as $orderDetail) {
            OrderDetail::updateOrCreate(
                ['id' => $orderDetail['id']],
                $orderDetail,
            );
        }
    }
}
