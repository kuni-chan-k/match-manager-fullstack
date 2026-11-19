# match-manager-fullstack（バックエンド連携版）

「Next.jsでバックエンド連携＆サービス公開」のサンプルコードです。
「Reactで作る！フロントエンド完結アプリ開発」のlocalStorage版を PostgreSQL + JWT認証に拡張したバージョンです。

## 機能

- 大会・チーム・試合のCRUD
- 順位表の自動計算
- JWT認証（サインアップ・ログイン・ログアウト）
- ロールベースのアクセス制御 (user / organizer / admin)

## 技術スタック

- Next.js 16 (App Router)
- React 18 / TypeScript / Tailwind CSS
- PostgreSQL + Prisma ORM
- JWT (jsonwebtoken + bcryptjs)

## セットアップ

```bash
# 1. 環境変数ファイルを作成
cp .env.example .env.local

# 2. PostgreSQLを起動（Docker の場合）
docker run --name match-manager-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# 3. データベースを作成
psql -U postgres -c "CREATE DATABASE match_manager;"

# 4. 依存パッケージをインストール
npm install

# 5. マイグレーションを実行
npx prisma migrate dev --name init

# 6. 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアプリが起動します。

## 環境変数

`.env.local` に以下を設定してください（`.env.example` を参照）。

| 変数名 | 説明 |
|--------|------|
| DATABASE_URL | PostgreSQL の接続文字列 |
| JWT_SECRET | JWT 署名用の秘密鍵（推測されにくい長い文字列） |

## ディレクトリ構成

```
match-manager-fullstack/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/               # 認証 API
│   │   ├── competitions/       # 大会 API
│   │   ├── teams/              # チーム API
│   │   └── matches/            # 試合 API
│   ├── competitions/           # 大会ページ
│   ├── teams/                  # チームページ
│   ├── login/                  # ログインページ
│   ├── signup/                 # サインアップページ
│   ├── layout.tsx
│   └── page.tsx
├── components/                 # 共通コンポーネント
├── lib/
│   ├── auth.ts                 # JWT認証ユーティリティ
│   ├── hooks/                  # データ取得フック
│   ├── permissions.ts          # 権限チェック
│   ├── prisma.ts               # Prisma Client
│   ├── standings.ts            # 順位計算
│   ├── types.ts                # 型定義
│   └── utils.ts                # ユーティリティ関数
└── prisma/
    └── schema.prisma           # データベーススキーマ
```

## 対応する書籍

- https://zenn.dev/and_and_and/books/nextjs-fullstack-and-deployment
- 前提: https://zenn.dev/and_and_and/books/react-frontend-development
