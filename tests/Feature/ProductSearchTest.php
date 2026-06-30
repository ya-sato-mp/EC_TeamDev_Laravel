<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_search_by_category_and_sort()
    {
        // Create a test category
        \App\Models\Category::create(['id' => 1, 'name' => 'カテゴリーA']);
        \App\Models\Category::create(['id' => 2, 'name' => 'カテゴリーB']);

        // Create test products
        Product::create([
            'name' => 'ドラえもんアクスタ',
            'price' => 1000, 'stock' => 10, 'is_public' => 1,
            'category_id' => 1, 'information' => '商品説明',
        ]);

        Product::create([
            'name' => 'ドラちゃんぬいぐるみM',
            'price' => 2000, 'stock' => 5, 'is_public' => 1,
            'category_id' => 2, 'information' => '商品説明',
        ]);

        Product::create([
            'name' => '野比のび太Tシャツ',
            'price' => 1500, 'stock' => 8, 'is_public' => 1,
            'category_id' => 1, 'information' => '商品説明',
        ]);

        // カテゴリーID=1 の商品のみ取得できること
        $response = $this->getJson('/api/products?category_id=1');
        $response->assertStatus(200);
        $data = $response->json();
        $names = collect($data)->pluck('name')->toArray();

        $this->assertContains('ドラえもんアクスタ', $names);
        $this->assertContains('野比のび太Tシャツ', $names);
        $this->assertNotContains('ドラちゃんぬいぐるみM', $names);

        // カテゴリーID=2 の商品のみ取得できること
        $response2 = $this->getJson('/api/products?category_id=2');
        $data2 = $response2->json();
        $names2 = collect($data2)->pluck('name')->toArray();
        $this->assertContains('ドラちゃんぬいぐるみM', $names2);
        $this->assertNotContains('ドラえもんアクスタ', $names2);

        // sort=newest でID降順になること
        $response3 = $this->getJson('/api/products?sort=newest');
        $data3 = $response3->json();
        $this->assertCount(3, $data3);
        $this->assertGreaterThanOrEqual(
            $data3[1]['id'], $data3[0]['id'],
            '新着順では最初の要素のIDが2番目以上であること'
        );
    }
}
