# 神戸 Gourmet Guide

インバウンド向け飲食店チラシ・Web自動生成システム

## ファイル構成

```
kobe-gourmet-guide/
├── index.html          # トップページ（店舗一覧・検索）
├── store.html          # 店舗詳細ページ
├── map.html            # 地図ページ（Google Maps）
├── flyer-front.html    # A4チラシ 表面
├── flyer-back.html     # A4チラシ 裏面
├── admin.html          # 管理画面
├── config.js           # ★APIキー設定ファイル
├── css/
│   ├── style.css       # Webサイト用スタイル
│   └── flyer.css       # チラシ印刷用スタイル
└── js/
    ├── airtable.js     # Airtable API連携
    ├── qrcode-gen.js   # QRコード生成
    └── sample-data.js  # サンプルデータ（デモ用）
```

## セットアップ

### 1. APIキーの設定

`config.js` を開き、以下の値を入力：

```js
airtable: {
  apiKey: 'patXXXXXXXXXXXXXX',   // Airtable Personal Access Token
  baseId: 'appXXXXXXXXXXXXXX',   // AirtableのベースID
},
googleMaps: {
  apiKey: 'AIzaSyXXXXXXXXXXXXXX', // Google Maps JavaScript API キー
},
site: {
  url: 'https://yourusername.github.io/kobe-gourmet-guide',
},
```

### 2. Airtableテーブルの設定

テーブル名：`Restaurants`

| フィールド名 | 型 |
|---|---|
| 店舗番号 | 数値 |
| 掲載区分 | 単一選択（L / M / WEB）|
| 店名 | テキスト |
| 料理名 | テキスト |
| 料理写真 | 添付ファイル |
| ロゴ | 添付ファイル |
| 説明 | 長文テキスト |
| 住所 | テキスト |
| 緯度 | 数値 |
| 経度 | 数値 |
| GoogleMap URL | URL |
| 営業時間 | テキスト |
| 定休日 | テキスト |
| 電話番号 | 電話番号 |
| Instagram | テキスト（@なし） |
| ホームページ | URL |
| ジャンル | テキスト |
| おすすめ料理 | テキスト |
| クーポン | テキスト |
| 公開ON/OFF | チェックボックス |
| 表示順位 | 数値 |

### 3. GitHub Pages への公開

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/USERNAME/kobe-gourmet-guide.git
git push -u origin main
```

GitHubリポジトリの Settings → Pages → Source: `main` ブランチを選択。

## チラシの印刷・PDF出力

1. `flyer-front.html` をブラウザで開く
2. 「印刷 / PDF保存」ボタンをクリック
3. 宛先：「PDFとして保存」を選択
4. 用紙サイズ：A4、余白：なし に設定
5. 保存

## 掲載区分

| 区分 | 枠数 | チラシ掲載 |
|---|---|---|
| L | 最大2枠 | 表面：大サイズ |
| M | 最大6枠 | 表面：中サイズ |
| WEB | 無制限 | 裏面＋Webのみ |

## QRコード

各店舗のQRコードはGoogleマップの経路案内URLを生成します：
```
https://www.google.com/maps/dir/?api=1&destination=緯度,経度
```
スマートフォンで読み取ると現在地からの案内が開始されます。
