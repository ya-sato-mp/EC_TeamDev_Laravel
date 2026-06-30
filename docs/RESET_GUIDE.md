# ドラちゃんオフィシャルショップ 再構築手順

## 目的

ローカル環境をまっさらにして, 初期データまで入れ直すための1枚手順である.

## これだけやる

```bash
composer install
php artisan storage:link
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8001
```

## 確認URL

- [http://127.0.0.1:8001/shop/login.html](http://127.0.0.1:8001/shop/login.html)
- [http://127.0.0.1:8001/admin/login.html](http://127.0.0.1:8001/admin/login.html)

## 入る順番

1. `shop/login.html` を開く.
2. 一般ユーザーは新規登録か既存ログインを使う.
3. 管理者は `admin@example.com / password` でログインする.
4. 管理者はショップ右上の `管理` から `admin/index.html` に入る.

## 何が入るか

- 管理者1件, 一般ユーザー2件
- カテゴリ12件
- 商品6件
- カート3件
- 注文2件
- 注文明細3件

## 補足

- 商品画像を使うなら `storage:link` は必須である.
- DBを完全に作り直すので, 既存データは消える.
- 初期状態を再現したいときは `migrate:fresh --seed` を使う.

