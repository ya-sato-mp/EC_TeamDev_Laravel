<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::statement('PRAGMA foreign_keys = OFF;');

        foreach ([
            'personal_access_tokens',
            'order_details',
            'orders',
            'cart_items',
            'products',
            'categories',
            'users',
        ] as $table) {
            DB::table($table)->delete();
        }

        DB::statement('PRAGMA foreign_keys = ON;');

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            CartItemSeeder::class,
            OrderSeeder::class,
            OrderDetailSeeder::class,
        ]);
    }
}
