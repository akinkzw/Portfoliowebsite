# Netlify デプロイ設定ガイド

## 🚀 Netlifyへのデプロイ手順

### 1. GitHubにプッシュ

```bash
# ローカルでリポジトリを初期化
git init
git add .
git commit -m "Initial commit: Portfolio with Netlify config"
git branch -M main
git remote add origin https://github.com/yourusername/Portfoliowebsite.git
git push -u origin main
```

---

### 2. Netlifyでプロジェクトをインポート

1. **[Netlify](https://app.netlify.com/)** にアクセス
2. 「Add new site」→「Import an existing project」を選択
3. GitHubを選択してログイン
4. リポジトリ `Portfoliowebsite` を選択

---

### 3. ビルド設定（自動検出されるはず）

Netlifyが `netlify.toml` を検出し、以下の設定を自動適用：

| 項目 | 値 |
|------|-----|
| **Build command** | `npm run build` |
| **Publish directory** | `dist` |
| **Node version** | 18 |

**確認方法：**
- Site settings → Build & deploy → Build settings

---

### 4. 環境変数を設定

**Site settings → Environment variables → Add a variable**

以下の3つの環境変数を設定：

#### ① microCMS Service Domain
```
Key:   VITE_MICROCMS_SERVICE_DOMAIN
Value: your-service-name
```
（例：`my-portfolio` の場合、`my-portfolio.microcms.io` の `my-portfolio` 部分）

#### ② microCMS API Key
```
Key:   VITE_MICROCMS_API_KEY
Value: your-api-key-here
```

#### ③ パスワード（本番環境用）
```
Key:   VITE_PASSWORD
Value: your-production-password
```

**重要：**
- すべての環境変数は `VITE_` プレフィックスが必要
- Netlify UIで設定した環境変数は、ビルド時とランタイムの両方で利用可能
- 設定後、「Save」をクリック

---

### 5. デプロイ

環境変数を設定したら、Netlifyが自動的にビルドを開始します。

**手動でデプロイをトリガーする場合：**
1. Deploys タブに移動
2. 「Trigger deploy」→「Deploy site」をクリック

---

## 🔍 ビルドプロセスの確認

### デプロイログで確認すべきこと

```bash
# 1. 依存関係のインストール
npm install --legacy-peer-deps

# 2. Viteビルド
npm run build

# 3. 出力先の確認
Building for production...
dist/index.html                   0.xx kB
dist/assets/index-xxxxx.css      xx.xx kB
dist/assets/index-xxxxx.js      xxx.xx kB

# 4. Publish完了
Site is live ✨
```

---

## ⚙️ netlify.toml の設定内容

現在の `netlify.toml` には以下が設定されています：

### ビルド設定
```toml
[build]
  command = "npm run build"
  publish = "dist"
  node_bundler = "esbuild"

[build.environment]
  NODE_VERSION = "18"
```

### リダイレクト設定（SPA用）
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
※ HashRouterを使用しているため、実際には不要ですが、念のため設定

### キャッシュ設定
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🌐 カスタムドメインの設定（オプション）

### Netlifyのデフォルトドメイン
```
https://your-site-name.netlify.app
```

### カスタムドメインを追加する場合
1. **Domain settings** → **Add custom domain**
2. ドメインを入力（例：`portfolio.example.com`）
3. DNS設定でNetlifyのネームサーバーまたはCNAMEレコードを追加

---

## 🔒 HTTPS

Netlifyは自動的に **Let's Encrypt** の無料SSL証明書を提供します。
- デプロイ後、数分でHTTPSが有効化されます
- 証明書は自動更新されます

---

## 🐛 トラブルシューティング

### ❌ ビルドが失敗する場合

#### 原因1: 依存関係のエラー
```bash
# 解決策：.npmrc が正しく設定されているか確認
legacy-peer-deps=true
```

#### 原因2: Tailwind CSS v3の設定エラー
```bash
# 解決策：以下のファイルが存在するか確認
- tailwind.config.js
- postcss.config.js
```

#### 原因3: TypeScriptエラー
```bash
# 解決策：ローカルで事前にビルドテスト
npm run build
```

---

### ❌ CSSが適用されない場合

#### 確認事項：
1. `tailwind.config.js` の `content` パスが正しいか
   ```js
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ]
   ```

2. `src/styles/globals.css` で Tailwind をインポートしているか
   ```css
   @import "tailwindcss";
   ```

3. `src/main.tsx` で CSS をインポートしているか
   ```tsx
   import './styles/globals.css';
   ```

---

### ❌ 環境変数が反映されない場合

#### 確認事項：
1. すべての環境変数名が `VITE_` で始まっているか
2. Netlify UIで正しく設定されているか
3. 設定後に再デプロイしたか（「Trigger deploy」→「Clear cache and deploy site」）

---

## 📊 デプロイステータスバッジ（オプション）

README.mdに追加：

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)
```

**取得方法：**
1. Site settings → General → Status badges
2. Markdownコードをコピー

---

## 🔄 継続的デプロイ

GitHubにプッシュするたびに、Netlifyが自動的に：
1. ✅ 最新のコードを取得
2. ✅ `npm install --legacy-peer-deps` を実行
3. ✅ `npm run build` を実行
4. ✅ `dist/` フォルダをデプロイ
5. ✅ サイトを公開

---

## 📝 まとめ

### ✅ 必要なファイル（すべて作成済み）
- `netlify.toml` - Netlify設定
- `.gitignore` - Git除外設定
- `.npmrc` - npm設定
- `package.json` - 依存関係
- `vite.config.ts` - Vite設定
- `tailwind.config.js` - Tailwind設定
- `postcss.config.js` - PostCSS設定

### ✅ 次のステップ
1. Figma Makeからプロジェクトをダウンロード
2. GitHubにプッシュ
3. Netlifyでインポート
4. 環境変数を設定
5. デプロイ完了！

---

**🎉 Netlifyへの移行準備が完了しました！**
