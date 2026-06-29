# EC_TeamDev_Laravel

## スプレッドシートはここから

https://docs.google.com/spreadsheets/d/12FcwAGsx_835jYahXsNZSjHp3cpUlgdKtJt4i5tuoN8/edit?gid=0#gid=0

Commit Messageはyyyymmdd + 何時何分(24時間表記) + Update.md

# ドラちゃんオフィシャルショップ 使い方

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

## 画面一覧

### ユーザー側

- `public/shop/login.html`
  - ログイン画面である.
- `public/shop/register.html`
  - 新規登録画面である.
- `public/shop/index.html`
  - 商品一覧画面である.
- `public/shop/product.html?id=商品ID`
  - 商品詳細画面である.
- `public/shop/cart.html`
  - カート一覧画面である.
- `public/shop/orders.html`
  - 注文履歴画面である.

### 管理者側

- `public/admin/login.html`
  - 管理者ログイン画面である.
- `public/admin/index.html`
  - 商品管理画面である.
  - 商品追加, 商品の公開切替, 価格変更, 在庫変更, 削除ができる.
- `public/admin/orders.html`
  - 注文確認画面である.

## 画面遷移の考え方

- 原則として最初は`/shop/login.html`から入る.
- 管理者権限のあるユーザーでログインした場合のみ, ショップ上部ナビに`管理`リンクが表示される.
- `管理`を押すと`/admin/index.html`へ移動できる.
- 管理者でないユーザーが`/admin/`へ直接入った場合は, ショップ側へ戻す実装になっている.

## ログイン情報

ローカルDBに確認用の管理者ユーザーが入っている.

- メールアドレス
  - `admin@example.com`
- パスワード
  - `password`

必要に応じて, 管理画面の`管理者を追加`フォームから追加作成できる.

## ユーザー側の使い方

1. `register.html`で一般ユーザー登録を行う.
2. `login.html`でログインする.
3. `index.html`で商品一覧を見る.
4. `詳細を見る`から`product.html`へ進む.
5. `カートに追加`で商品をカートへ入れる.
6. `cart.html`で内容を確認し, `注文する`を押す.
7. `orders.html`で注文履歴を確認する.

## 管理者側の使い方

1. 管理者アカウントでログインする.
2. ショップ上部の`管理`を押す, または`/admin/login.html`から入る.
3. `商品を追加`フォームでカテゴリ, 商品名, 価格, 説明, 在庫数, 画像, 公開状態を登録する.
4. `登録商品`一覧でカテゴリ, 価格, 在庫, 公開状態を更新できる.
5. `注文確認`で注文一覧を確認する.

## カテゴリについて

管理画面上ではカテゴリを日本語ラベルで選ぶ.
内部では`category_id`で保持している.

現在のカテゴリは以下である.

1. ファッション
2. PC・モバイル用品
3. 生活雑貨
4. リビング・インテリア
5. タオル
6. キッチン・食器・ランチ
7. トイ・ホビー
8. ぬいぐるみ
9. キーホルダー
10. ステーショナリー
11. 食品
12. お買い物袋・その他

## 画像について

- 商品画像は管理画面の商品追加フォームから登録する.
- 画像ファイルはLaravelの`storage/app/public/products`に保存される.
- ブラウザ表示では`/storage/products/...`経由で読み込む.
- 画像が表示されない場合は, まず`php artisan storage:link`が作成済みか確認する.

## 在庫と注文について

- 注文時には, カート内商品の数量に応じて在庫が減る実装である.
- 在庫が`0`になった商品は, ショップ上で`品切れ`表示になる.
- `品切れ`商品はカート追加ボタンが無効化される.

## 関連ファイル

- `public/shop/index.html`
- `public/shop/product.html`
- `public/shop/cart.html`
- `public/shop/orders.html`
- `public/shop/app.js`
- `public/shop/styles.css`
- `public/admin/index.html`
- `public/admin/orders.html`
- `public/admin/app.js`
- `public/admin/styles.css`

## よく使うコマンド

```bash
php artisan serve --host=127.0.0.1 --port=8001
php artisan storage:link
php artisan route:list
```

`storage:link`はストレージ公開用のシンボリックリンク作成コマンドである. 
`route:list`はLaravelに登録されているルート一覧確認コマンドである.


## 命名規則

PJ名 Doraemon_EC

### テーブル名 複数形で統一

users
products
categories

### モデル名 単数形で統一

User
Product
Category

### コントローラー名

ProductController
CategoryController
CartItemController

### 担当

## 管理者側

商品一覧
商品登録
商品編集
商品削除
カテゴリ一覧
カテゴリ登録

## ユーザー側

商品一覧
商品詳細
カート追加
カート一覧
注文処理
注文履歴
