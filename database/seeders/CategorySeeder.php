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
        $categories = [
            1 => 'ファッション',
            2 => 'PC・モバイル用品',
            3 => '生活雑貨',
            4 => 'リビング・インテリア',
            5 => 'タオル',
            6 => 'キッチン・食器・ランチ',
            7 => 'トイ・ホビー',
            8 => 'ぬいぐるみ',
            9 => 'キーホルダー',
            10 => 'ステーショナリー',
            11 => '食品',
            12 => 'お買い物袋・その他',
        ];

        foreach ($categories as $id => $name) {
            Category::updateOrCreate(
                ['id' => $id],
                ['name' => $name],
            );
        }
    }
}
