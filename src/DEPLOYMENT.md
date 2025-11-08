# 🚀 デプロイガイド

このポートフォリオサイトをVercelにデプロイする手順です。

## 📋 必要なもの

- GitHubアカウント
- Vercelアカウント（無料）
- microCMSのサービスドメインとAPIキー

## 🔧 デプロイ手順

### 1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 「New repository」をクリック
3. リポジトリ名を入力（例：`portfolio`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

### 2. コードをGitHubにプッシュ

ローカルでプロジェクトフォルダを開き、以下のコマンドを実行：

```bash
# Gitリポジトリを初期化
git init

# ファイルをステージング
git add .

# コミット
git commit -m "Initial commit"

# リモートリポジトリを追加（YOUR_USERNAMEとYOUR_REPOを自分の情報に変更）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# プッシュ
git branch -M main
git push -u origin main
```

### 3. Vercelでデプロイ

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」でGitHubアカウントで登録
3. 「Import Project」をクリック
4. GitHubリポジトリを選択
5. 「Import」をクリック

### 4. 環境変数の設定（重要！）

#### 📍 ステップバイステップ手順

**4-1. Vercelダッシュボードを開く**
- デプロイが完了したら、Vercelのダッシュボードに自動的に移動します
- または、[vercel.com/dashboard](https://vercel.com/dashboard) にアクセス

**4-2. プロジェクトを選択**
- 作成したプロジェクト（例：`portfolio`）をクリック

**4-3. Settings（設定）を開く**
- 画面上部のタブから「Settings」をクリック

**4-4. Environment Variables（環境変数）ページへ**
- 左サイドバーから「Environment Variables」をクリック
- または、設定ページを下にスクロール

**4-5. 環境変数を1つずつ追加**

以下の3つの環境変数を追加します：

##### ① microCMSサービスドメイン
```
Name (キー):  VITE_MICROCMS_SERVICE_DOMAIN
Value (値):   xorqasmzf7
```

1. 「Name」欄に `VITE_MICROCMS_SERVICE_DOMAIN` と入力（コピペ推奨）
2. 「Value」欄に `xorqasmzf7` と入力
3. Environment（環境）は「Production」「Preview」「Development」すべてにチェック
4. 「Save」ボタンをクリック

##### ② microCMS APIキー
```
Name (キー):  VITE_MICROCMS_API_KEY
Value (値):   nVtMhU5LZYMqQGB6crHG8WAjMVsghfMAQ49a
```

1. 「Name」欄に `VITE_MICROCMS_API_KEY` と入力
2. 「Value」欄に `nVtMhU5LZYMqQGB6crHG8WAjMVsghfMAQ49a` と入力
3. すべての環境にチェック
4. 「Save」をクリック

##### ③ サイトパスワード（あなたが決める！）
```
Name (キー):  VITE_SITE_PASSWORD
Value (値):   あなたの好きなパスワード
```

1. 「Name」欄に `VITE_SITE_PASSWORD` と入力
2. 「Value」欄に**あなたが決めたパスワード**を入力
   - 例：`MyPortfolio2024!`
   - 例：`SecurePass123`
   - 例：`クライアント確認用`（日本語OK）
3. すべての環境にチェック
4. 「Save」をクリック

⚠️ **重要ポイント**
- パスワードは**あなたが自由に決められます**
- 8文字以上を推奨
- 英数字・記号・日本語すべて使用可能
- このパスワードで訪問者がサイトにログインします
- 後で変更可能です（再デプロイが必要）

**4-6. 再デプロイを実行**

環境変数を追加しただけでは反映されないため、再デプロイが必要です：

1. 画面上部のタブから「Deployments」をクリック
2. 一番上の最新デプロイメントの右側にある「...」（3点メニュー）をクリック
3. 「Redeploy」を選択
4. 確認ダイアログで「Redeploy」をもう一度クリック
5. 2-3分待つとデプロイが完了します

**4-7. 動作確認**

1. 「Visit」ボタンをクリックしてサイトにアクセス
2. パスワード入力画面が表示されることを確認
3. 設定したパスワードを入力してログインできることを確認

### 5. デプロイ完了 🎉

数分後、Vercelが自動的にURLを生成します：
```
https://your-project-name.vercel.app
```

## 🔄 更新方法

### コードの更新

```bash
# 変更を加えた後
git add .
git commit -m "更新内容の説明"
git push
```

GitHubにプッシュすると、Vercelが**自動的に再デプロイ**します！

### microCMSの更新

microCMSで作品を追加・編集すると、**サイトに即座に反映**されます。
（コードの変更は不要）

## 🌐 独自ドメインの設定（オプション）

Vercelで独自ドメインを設定する場合：

1. Vercelのプロジェクト設定
2. 「Domains」タブ
3. 独自ドメインを入力して追加
4. DNS設定に従って設定

## 📱 確認項目

デプロイ後、以下を確認：

- ✅ すべてのページが表示される
- ✅ microCMSからデータが取得できる
- ✅ 画像が正しく表示される
- ✅ カテゴリページが動作する
- ✅ タグフィルタリングが動作する
- ✅ ライトボックスが動作する
- ✅ 外部リンクが動作する（Webカテゴリ）

## ⚠️ トラブルシューティング

### microCMSのデータが表示されない

1. 環境変数が正しく設定されているか確認
2. microCMSのAPIキーが有効か確認
3. Vercelで再デプロイ

### ビルドエラー

1. `package.json`の依存関係を確認
2. TypeScriptのエラーを修正
3. ローカルで`npm run build`が成功するか確認

## 🔐 セキュリティ

- ✅ APIキーは環境変数で管理
- ✅ `.env`ファイルは`.gitignore`に含まれている
- ✅ microCMSのAPIキーはGET専用キーを使用

## 📞 サポート

問題が発生した場合：
- [Vercelドキュメント](https://vercel.com/docs)
- [microCMSドキュメント](https://document.microcms.io/)
