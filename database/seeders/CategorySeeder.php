<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Seed the categories table.
     */
    public function run(): void
    {
        foreach (SeedData::categories() as $id => $name) {
            Category::updateOrCreate(
                ['id' => $id],
                ['name' => $name],
            );
        }
    }
}
