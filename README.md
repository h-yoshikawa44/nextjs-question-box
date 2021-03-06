# nextjs-question-box
個人勉強用リポジトリ

教材出典：[Next.jsとFirebaseで質問箱のようなサービスを作る](https://zenn.dev/dala/books/nextjs-firebase-service)

※メモは TIL の方にコミット

## 環境
- TypeScript：4.2.2
- Node.js：14.2.0
- Next.js：10.0.7

## 環境立ち上げ
ライブラリインストール（初回）
```
$ yarn install
```

.env.local を作成して、必要な環境変数を設定（初回）
```
cp .env.example .env.local
```

Next.js サーバ立ち上げ
```
$ yarn dev
```
localhost:3000 でサイト表示
