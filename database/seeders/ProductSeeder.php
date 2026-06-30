<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Seed the products table.
     */
    public function run(): void
    {
        foreach (SeedData::products() as $product) {
            Product::updateOrCreate(
                ['id' => $product['id']],
                $product,
            );
        }
    }
}
