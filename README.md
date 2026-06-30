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
このプロジェクトはLaravelのAPIをバックエンドに使い, `public/shop`と`public/admin`配下の静的HTML, CSS, JavaScriptで画面を動かす構成である.
ローカルで確認する場合は, まず`php artisan serve --host=127.0.0.1 --port=8001`を実行し, 玄関口として`/shop/login.html`に入るのが基本である.

## 起動手順

プロジェクトルートで以下を実行する.

```bash
composer install
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8001
```

補足は以下である.

- `composer install`
  - PHP依存関係を入れる.
- `php artisan storage:link`
  - 商品画像を`/storage/...`で配信するために必要である.
- `php artisan serve --host=127.0.0.1 --port=8001`
  - ローカル確認用サーバを起動する.

起動後の確認URLは以下である.

- 共通の入口
  - [http://127.0.0.1:8001/shop/login.html](http://127.0.0.1:8001/shop/login.html)
- 管理者ログイン画面
  - [http://127.0.0.1:8001/admin/login.html](http://127.0.0.1:8001/admin/login.html)

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
