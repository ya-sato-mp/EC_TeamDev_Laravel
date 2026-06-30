<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

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

        if (DB::getDriverName() === 'sqlite') {
            DB::statement("DELETE FROM sqlite_sequence WHERE name IN ('personal_access_tokens', 'order_details', 'orders', 'cart_items', 'products', 'categories', 'users')");
        }

        Schema::enableForeignKeyConstraints();
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        foreach (
            [
                'personal_access_tokens',
                'order_details',
                'orders',
                'cart_items',
                'products',
                'categories',
                'users',
            ] as $table
        ) {
            DB::table($table)->delete();
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

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
