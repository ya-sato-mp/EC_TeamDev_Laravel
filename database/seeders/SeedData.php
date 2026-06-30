<?php

namespace Database\Seeders;

final class SeedData
{
    public static function users(): array
    {
        return [
            [
                'id' => 1,
                'name' => '管理者ユーザー',
                'email' => 'admin@example.com',
                'password' => 'password',
                'role' => 'admin',
            ],
            [
                'id' => 2,
                'name' => '一般ユーザー',
                'email' => 'user@example.com',
                'password' => 'password',
                'role' => 'user',
            ],
            [
                'id' => 3,
                'name' => '研修テストユーザー',
                'email' => 'sample@example.com',
                'password' => 'password',
                'role' => 'user',
            ],
        ];
    }

    public static function categories(): array
    {
        return [
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
    }

    public static function products(): array
    {
        return [
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
                'price' => 750,
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
    }

    public static function cartItems(): array
    {
        return [
            [
                'id' => 1,
                'user_id' => 2,
                'product_id' => 2,
                'quantity' => 1,
            ],
            [
                'id' => 2,
                'user_id' => 2,
                'product_id' => 4,
                'quantity' => 2,
            ],
            [
                'id' => 3,
                'user_id' => 3,
                'product_id' => 1,
                'quantity' => 1,
            ],
        ];
    }

    public static function orders(): array
    {
        return [
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
    }

    public static function orderDetails(): array
    {
        return [
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
    }
}
