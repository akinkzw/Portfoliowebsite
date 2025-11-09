# GitHub Pagesデプロイ手順

このドキュメントでは、ポートフォリオサイトをGitHub Pagesにデプロイする手順を説明します。

## 📋 前提条件

- GitHubアカウント
- microCMSのサービスドメインとAPI Key
- ポートフォリオサイトのパスワード

---

## 🚀 デプロイ手順

### **Step 1: GitHubリポジトリを作成**

1. GitHubにログイン
2. 新しいリポジトリを作成
   - リポジトリ名: `Portfoliowebsite` (または任意の名前)
   - Public または Private

### **Step 2: vite.config.tsのbaseパスを確認**

`vite.config.ts`の`base`プロパティがリポジトリ名と一致していることを確認：

```ts
export default defineConfig({
  base: '/Portfoliowebsite/', // リポジトリ名に合わせる
  // ...
});
```

**重要**: リポジトリ名を変更した場合は、この値も変更してください。

### **Step 3: 環境変数をGitHub Secretsに設定**

1. GitHubリポジトリページで **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** をクリック
3. 以下の3つのSecretを追加：

| Name | Value | 説明 |
|------|-------|------|
| `VITE_MICROCMS_SERVICE_DOMAIN` | `your-service` | microCMSのサービスドメイン |
| `VITE_MICROCMS_API_KEY` | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` | microCMSのAPI Key |
| `VITE_PASSWORD` | `your-password` | ポートフォリオサイトのパスワード |

#### 環境変数の取得方法

**microCMS:**
1. microCMSにログイン
2. **サービス設定** → **API キー**
3. `サービスドメイン`と`API Key`をコピー

### **Step 4: GitHub Pagesを有効化**

1. GitHubリポジトリページで **Settings** → **Pages**
2. **Source** を **GitHub Actions** に設定
3. 保存

### **Step 5: コードをGitHubにプッシュ**

#### ローカルでGitリポジトリを初期化（初回のみ）

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/Portfoliowebsite.git
cd Portfoliowebsite

# または、既存のプロジェクトをプッシュ
git init
git remote add origin https://github.com/YOUR_USERNAME/Portfoliowebsite.git
```

#### プッシュ

```bash
# src/ディレクトリ内のファイルのみをステージング
git add .github/
git add src/
git add index.html
git add package.json
git add vite.config.ts
git add tailwind.config.js
git add postcss.config.js
git add tsconfig.json
git add tsconfig.node.json
git add .gitignore
git add README.md
git add GITHUB_PAGES_SETUP.md
git add components/figma/

# コミット
git commit -m "Initial commit: Portfolio site"

# プッシュ
git push -u origin main
```

**⚠️ 注意**: `.gitignore`で除外されているファイル（`/App.tsx`, `/components/ui/`, `/styles/`など）はプッシュされません。

### **Step 6: デプロイを確認**

1. GitHubリポジトリページで **Actions** タブを開く
2. **Deploy to GitHub Pages** ワークフローが実行中
3. ✅ 成功したら、**Settings** → **Pages** でサイトのURLを確認
4. `https://YOUR_USERNAME.github.io/Portfoliowebsite/` にアクセス

---

## 🔧 トラブルシューティング

### ❌ ビルドが失敗する

**原因**: 環境変数が設定されていない

**解決策**:
1. **Settings** → **Secrets and variables** → **Actions**
2. 3つのSecretsが正しく設定されているか確認

### ❌ ページが表示されない（404エラー）

**原因1**: `vite.config.ts`の`base`が間違っている

**解決策**:
```ts
base: '/YOUR_REPO_NAME/', // リポジトリ名と一致させる
```

**原因2**: GitHub Pagesが有効化されていない

**解決策**:
1. **Settings** → **Pages**
2. **Source** を **GitHub Actions** に設定

### ❌ CSSが適用されない

**原因**: ルート直下の重複ファイルがプッシュされている

**解決策**:
```bash
# GitHubから重複ファイルを削除
git rm --cached App.tsx
git rm --cached -r components/ui/
git rm --cached -r styles/
git commit -m "Remove duplicate files"
git push
```

### ❌ microCMSのデータが表示されない

**原因**: 環境変数が正しく設定されていない

**解決策**:
1. GitHub Secretsの値を確認
2. microCMSのAPI Keyが有効か確認
3. CORSの設定を確認（GitHub PagesのドメインをmicroCMSの許可リストに追加）

---

## 📊 デプロイ後の更新方法

コードを変更した場合：

```bash
# 変更をステージング
git add .

# コミット
git commit -m "Update: 変更内容の説明"

# プッシュ（自動的に再デプロイされます）
git push
```

---

## 🎯 重要なポイント

### ✅ 正しいファイル構造（GitHub上）

```
Portfoliowebsite/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/                          ← 全てのソースコード
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── components/
│   └── figma/
│       └── ImageWithFallback.tsx  ← 保護ファイル
├── index.html
├── package.json
├── vite.config.ts
└── .gitignore
```

### ❌ プッシュしてはいけないファイル

以下のファイルは`.gitignore`で除外されています：
- `/App.tsx` (重複)
- `/components/ui/` (重複)
- `/styles/` (重複)
- `/node_modules/`
- `/dist/`
- `.env`

---

## 🔒 セキュリティ

- ✅ 環境変数はGitHub Secretsに保存（安全）
- ✅ API KeyはGitHubにプッシュされない
- ✅ パスワード保護機能が有効
- ⚠️ フロントエンドアプリのため、機密データは扱わないでください

---

## 📱 カスタムドメイン（オプション）

カスタムドメインを使用する場合：

1. **Settings** → **Pages** → **Custom domain**
2. ドメイン名を入力（例: `portfolio.example.com`）
3. DNSレコードを設定:
   ```
   CNAME  portfolio  YOUR_USERNAME.github.io
   ```

---

## 🎉 完成！

GitHub Pagesでポートフォリオサイトが公開されました！

**サイトURL**: `https://YOUR_USERNAME.github.io/Portfoliowebsite/`

次のステップ：
- [ ] microCMSでコンテンツを追加
- [ ] デザインをカスタマイズ
- [ ] OGP画像を設定
- [ ] Google Analyticsを追加（オプション）
