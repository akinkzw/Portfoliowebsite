# Creative Portfolio

テキスタイルデザイン、Webデザイン、写真、動画の作品を掲載した個人ポートフォリオサイト

## 🎨 Features

- **カテゴリ分類**: textile / web / photo の3カテゴリ
- **タグフィルタリング**: AND条件でのタグ検索機能
- **表示順序制御**: microCMSの`displayOrder`フィールドで並び替え
- **ライトボックス表示**: カテゴリごとに最適な比率で作品を表示
- **外部リンク機能**: Webカテゴリ作品の外部サイトリンク
- **パスワード保護**: 環境変数によるアクセス制御
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v6 (HashRouter)
- **CMS**: microCMS
- **Animation**: Motion (旧Framer Motion)
- **Build**: Vite
- **Hosting**: Netlify

## 📁 Project Structure

```
/
├── src/
│   ├── App.tsx              # メインアプリケーション
│   ├── main.tsx             # エントリーポイント
│   ├── components/          # React コンポーネント
│   │   ├── About.tsx
│   │   ├── Categories.tsx
│   │   ├── Contact.tsx
│   │   ├── Header.tsx
│   │   ├── PasswordProtection.tsx
│   │   └── WorkCard.tsx
│   ├── pages/               # ページコンポーネント
│   │   ├── HomePage.tsx
│   │   └── CategoryPage.tsx
│   ├── lib/                 # ユーティリティ
│   │   └── microcms.ts
│   └── styles/
│       └── globals.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── netlify.toml

## 🚀 Setup & Development

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Environment Variables

`.env.local` ファイルを作成し、以下を設定：

```env
VITE_MICROCMS_SERVICE_DOMAIN=your-service-domain
VITE_MICROCMS_API_KEY=your-api-key
VITE_PASSWORD=your-password
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## 🌐 Deployment (Netlify)

### 1. リポジトリをGitHubにプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/Portfoliowebsite.git
git push -u origin main
```

### 2. Netlifyでプロジェクトをインポート

1. [Netlify](https://app.netlify.com)にアクセス
2. 「Add new site」→「Import an existing project」
3. GitHubを選択してログイン
4. リポジトリ `Portfoliowebsite` を選択
5. ビルド設定は `netlify.toml` から自動検出

### 3. 環境変数の設定

Site settings → Environment variables → Add a variable:

- `VITE_MICROCMS_SERVICE_DOMAIN`
- `VITE_MICROCMS_API_KEY`
- `VITE_PASSWORD`

**詳細な手順は `NETLIFY_SETUP.md` を参照してください。**

## 📝 microCMS Schema

### Work Content Type

| フィールド名 | フィールドID | 種類 | 必須 |
|------------|-------------|------|------|
| タイトル | title | テキスト | ✓ |
| カテゴリ | category | セレクト | ✓ |
| 画像 | image | 画像 | ✓ |
| 説明 | description | テキストエリア | - |
| タグ | tags | 複数選択 | - |
| 表示順序 | displayOrder | 数値 | - |
| 外部リンク | externalLink | テキスト | - |

### カテゴリ選択肢

- `textile` - Textile
- `web` - Web
- `photo` - Photo

## 📝 License

© 2025 Portfolio. All rights reserved.
