# EC_TeamDev_Laravel

Laravel研修用の `Doraemon_EC` プロジェクトである.
ユーザー側は `public/shop`, 管理者側は `public/admin` の静的HTML, CSS, JavaScriptで構成している.

## 参考資料

- スプレッドシート
  - https://docs.google.com/spreadsheets/d/12FcwAGsx_835jYahXsNZSjHp3cpUlgdKtJt4i5tuoN8/edit?gid=0#gid=0
- 使い方ガイド
  - [docs/SHOP_GUIDE.md](docs/SHOP_GUIDE.md)
- 再構築手順
  - [docs/RESET_GUIDE.md](docs/RESET_GUIDE.md)

## 進め方

- `php artisan serve --host=127.0.0.1 --port=8001` で起動する.
- 入口は [http://127.0.0.1:8001/shop/login.html](http://127.0.0.1:8001/shop/login.html) である.
- 画像を扱う前に `php artisan storage:link` を実行する.

## 命名規則

- PJ名 `Doraemon_EC`
- テーブル名は複数形で統一する.
  - `users`
  - `products`
  - `categories`
- モデル名は単数形で統一する.
  - `User`
  - `Product`
  - `Category`

## 役割

### 管理者側

- 商品一覧
- 商品登録
- 商品編集
- 商品削除
- カテゴリ一覧
- カテゴリ登録

### ユーザー側

- 商品一覧
- 商品詳細
- カート追加
- カート一覧
- 注文処理
- 注文履歴

## よく使うコマンド

```bash
composer install
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8001
php artisan migrate:fresh --seed
php artisan db:seed --force
php artisan route:list
```
