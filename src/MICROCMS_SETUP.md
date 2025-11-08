# microCMS セットアップガイド

## 概要
このポートフォリオサイトでは、1つのmicroCMS APIで全ての作品を管理し、カテゴリフィールドで分類します。

## 設定手順

### 1. microCMSアカウントの準備
1. [microCMS](https://microcms.io/)にログイン
2. 新しいサービスを作成（または既存のサービスを使用）

### 2. API の作成

#### API設定
- **API名**: `works`（作品）
- **エンドポイント**: `works`
- **API型**: リスト形式

#### フィールド設定
以下のフィールドを追加してください：

| フィールドID | 表示名 | 種類 | 必須 | 説明 |
|------------|--------|------|------|------|
| `title` | タイトル | テキストフィールド | ✓ | 作品のタイトル |
| `description` | 説明 | テキストフィールド | ✓ | 作品の説明文 |
| `imageUrl` | 画像URL | テキストフィールド | ✓ | 作品の画像URL |
| `category` | カテゴリ | セレクトフィールド | ✓ | 作品のカテゴリ |

##### categoryフィールドの選択肢
セレクトフィールドに以下の3つの選択肢を追加：
- `textile` - Textile
- `web` - Web
- `photo` - Photo

### 3. コンテンツの登録例

#### Textile カテゴリの作品例
```
タイトル: Geometric Pattern
説明: 幾何学模様を用いたテキスタイルデザイン
画像URL: https://images.unsplash.com/photo-xxx...
カテゴリ: textile
```

#### Web カテゴリの作品例
```
タイトル: E-commerce Platform
説明: モダンなECサイトのUIデザイン
画像URL: https://images.unsplash.com/photo-xxx...
カテゴリ: web
```

#### Photo カテゴリの作品例
```
タイトル: Urban Photography
説明: 都市の日常を切り取った写真作品
画像URL: https://images.unsplash.com/photo-xxx...
カテゴリ: photo
```

### 4. APIキーの取得

1. microCMSの管理画面で「API キー」タブを開く
2. 「GET」権限を持つAPIキーをコピー
3. サービスドメインもメモ（例: `myportfolio.microcms.io` の `myportfolio` 部分）

### 5. コードへの設定

`/lib/microcms.ts` ファイルを編集：

```typescript
const SERVICE_DOMAIN = 'myportfolio'; // ← あなたのサービスドメインに変更
const API_KEY = 'xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; // ← あなたのAPIキーに変更
```

## 動作確認

設定が完了すると：
- ページ読み込み時にmicroCMSから作品データを自動取得
- 各カテゴリに最新3件の作品を表示
- 「more」リンクからカテゴリ詳細ページへ遷移（今後実装予定）

## トラブルシューティング

### データが表示されない
- APIキーとサービスドメインが正しいか確認
- microCMSでコンテンツが公開されているか確認
- ブラウザのコンソールにエラーが出ていないか確認

### 画像が表示されない
- `imageUrl` フィールドに正しいURLが入っているか確認
- 画像URLがhttpsで始まっているか確認

## 注意事項

- 現在はmicroCMS未設定でもモックデータが表示されるため、開発は継続できます
- microCMS設定後は自動的にAPIからデータを取得します
- APIキーは公開リポジトリにコミットしないよう注意してください
