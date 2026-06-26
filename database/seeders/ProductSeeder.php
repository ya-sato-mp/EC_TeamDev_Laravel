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
        $products = [
            [
                'id' => 1,
                'category_id' => 7,
                'name' => 'ドラえもんアクスタ',
                'price' => 1500,
                'information' => '推し活用アクリルスタンド',
                'stock' => 10,
                'image' => null,
                'is_public' => true,
            ],
            [
                'id' => 2,
                'category_id' => 9,
                'name' => 'どこでもドアキーホルダー',
                'price' => 1200,
                'information' => 'バッグにつけやすい定番キーホルダー',
                'stock' => 25,
                'image' => null,
                'is_public' => true,
            ],
            [
                'id' => 3,
                'category_id' => 8,
                'name' => 'ドラちゃんぬいぐるみM',
                'price' => 4800,
                'information' => '棚置きしやすい中型サイズのぬいぐるみ',
                'stock' => 8,
                'image' => null,
                'is_public' => true,
            ],
            [
                'id' => 4,
                'category_id' => 10,
                'name' => 'ひみつ道具ノート',
                'price' => 650,
                'information' => '学校でも使いやすいB5ノート',
                'stock' => 40,
                'image' => null,
                'is_public' => true,
            ],
            [
                'id' => 5,
                'category_id' => 11,
                'name' => 'どら焼き風クッキー',
                'price' => 980,
                'information' => 'お土産向けの個包装クッキー',
                'stock' => 0,
                'image' => null,
                'is_public' => true,
            ],
            [
                'id' => 6,
                'category_id' => 4,
                'name' => 'お昼寝クッション',
                'price' => 3200,
                'information' => 'リビングに置きやすいクッション',
                'stock' => 12,
                'image' => null,
                'is_public' => false,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['id' => $product['id']],
                $product,
            );
        }
    }
}
