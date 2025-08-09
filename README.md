# SmartStocks - AIを使った株価分析・おすすめ銘柄抽出PWA

## プロジェクト概要

AIを活用した株価分析システムで、「れい」という女性キャラクターがユーザー「ひろ」に対してセリフ付きでおすすめ銘柄を提案するPWA（Progressive Web App）です。

**🆓 完全無料構成**: 各種サービスの無料枠を活用し、維持費ゼロでの運用を実現。詳細は `docs/free-tier-architecture.md` を参照。

## 主要機能

### 1. 株価分析機能
- リアルタイム株価データの取得・表示
- テクニカル分析（移動平均、RSI、MACD等）
- ファンダメンタル分析（PER、PBR、ROE等）
- チャート表示機能
- 過去データの分析・比較

### 2. AIおすすめ銘柄抽出機能
- 機械学習モデルによる銘柄スコアリング
- 市場トレンド分析
- ニュース・業績データの自然言語処理
- リスクレベル別の銘柄推奨
- ポートフォリオ最適化提案

### 3. れいキャラクター機能
- セリフ付きおすすめ銘柄紹介
- ユーザーとの会話インターフェース
- キャラクター表情・アニメーション
- 個別銘柄の解説・説明
- 投資アドバイス・注意喚起

### 4. PWA機能
- オフライン対応
- プッシュ通知（市場動向、重要銘柄情報）
- アプリライクなUI/UX
- モバイル・デスクトップ対応
- インストール可能

### 5. ユーザー管理機能
- ユーザープロフィール管理
- ウォッチリスト機能
- 投資履歴・パフォーマンス追跡
- 個人設定・カスタマイズ

## 技術スタック

### フロントエンド
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Charts**: Chart.js / D3.js
- **PWA**: next-pwa
- **State Management**: Zustand
- **UI Components**: Headless UI / Radix UI

### バックエンド（Serverless構成）
- **Runtime**: Node.js
- **Framework**: Next.js API Routes (Vercel Serverless Functions)
- **Database**: Supabase PostgreSQL (無料枠) + Vercel KV Redis (無料枠)
- **ORM**: Prisma
- **Authentication**: Supabase Auth (無料枠)

### AI・データ処理（無料/低コスト構成）
- **ML Framework**: Python (scikit-learn, pandas, numpy) - Vercel Serverless Functions
- **NLP**: OpenAI GPT-5 (将来リリース時) / GPT-4o (現在) + Hugging Face Transformers (無料)
- **Data Pipeline**: GitHub Actions (無料枠) + Vercel Cron Jobs
- **Real-time Processing**: Server-Sent Events (WebSocketの代替, 無料)

### インフラ・デプロイ（完全無料構成）
- **Hosting**: Vercel (フロントエンド無料枠) + Vercel Serverless Functions (バックエンド)
- **Database**: Supabase (無料枠: 500MB, 2GB転送/月) + Vercel KV (Redis代替, 無料枠)
- **CDN**: Cloudflare (無料枠)
- **Monitoring**: Vercel Analytics (無料枠) + GitHub Actions

### 外部API（無料枠活用）
- **株価データ**: Alpha Vantage (無料: 500リクエスト/日) + yfinance (Yahoo Finance スクレイピング)
- **ニュースデータ**: NewsAPI (無料: 1000リクエスト/日) + RSS Feed (無料)
- **経済指標**: FRED API (完全無料)
- **AI**: OpenAI GPT-5 (将来) / GPT-4o (現在・従量課金) または Hugging Face (無料)

## ディレクトリ構造

```
SmartStocks/
├── docs/                     # ドキュメント
│   ├── api-specification.md
│   ├── database-schema.md
│   ├── character-design.md
│   └── deployment-guide.md
├── frontend/                 # Next.js PWA
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── store/
│   ├── types/
│   └── public/
├── backend/                  # API サーバー
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── config/
├── ai-engine/               # AI・ML処理
│   ├── models/
│   ├── data-processing/
│   ├── pipelines/
│   └── training/
├── database/                # データベース関連
│   ├── migrations/
│   ├── seeds/
│   └── schemas/
├── scripts/                 # 運用スクリプト
└── tests/                   # テストコード
```

## 開発フロー

### Phase 1: 基盤構築（1-2週間）
1. プロジェクトセットアップ
2. Next.js PWA環境構築
3. データベース設計・セットアップ
4. 基本的なUI/UXデザイン
5. 株価データAPI統合

### Phase 2: コア機能開発（3-4週間）
1. 株価データ取得・表示機能
2. 基本的なチャート機能
3. ユーザー認証・管理機能
4. ウォッチリスト機能
5. 基本的なテクニカル分析

### Phase 3: AI機能統合（2-3週間）
1. AIモデル開発・訓練
2. おすすめ銘柄抽出ロジック
3. ニュース分析機能
4. スコアリングシステム

### Phase 4: れいキャラクター実装（2週間）
1. キャラクターデザイン・アセット作成
2. セリフ生成システム
3. 会話インターフェース
4. アニメーション・表情システム
5. パーソナリティエンジン

### Phase 5: PWA機能・最適化（1-2週間）
1. PWA機能実装
2. プッシュ通知システム
3. オフライン対応
4. パフォーマンス最適化
5. SEO対策

### Phase 6: テスト・デプロイ（1週間）
1. ユニット・統合テスト
2. E2Eテスト
3. パフォーマンステスト
4. セキュリティテスト
5. 本番デプロイ

## 主要な技術的考慮事項

### セキュリティ
- API認証・認可
- データ暗号化
- SQL インジェクション対策
- XSS対策
- CSRF対策

### パフォーマンス
- データキャッシュ戦略
- 画像最適化
- コード分割
- CDN活用
- データベースインデックス最適化

### スケーラビリティ
- 水平スケーリング対応
- マイクロサービス化の検討
- 負荷分散
- データベース分割

## 運用・保守

### モニタリング
- アプリケーション監視
- エラートラッキング
- パフォーマンス監視
- ユーザー行動分析

### データ管理
- 定期バックアップ
- データ保持ポリシー
- GDPR準拠
- データ品質管理

## 予算・リソース見積もり

### 開発リソース
- フロントエンド開発者: 1名
- バックエンド開発者: 1名
- AI/ML エンジニア: 1名
- UI/UXデザイナー: 1名
- プロジェクトマネージャー: 1名

### インフラコスト（月額概算）
- Hosting: $50-100
- Database: $30-50
- External APIs: $100-200
- CDN: $20-30
- Monitoring: $20-30

### 開発期間
- 総期間: 10-14週間
- MVP版: 6-8週間
- フル機能版: 10-14週間

## ライセンス・法的考慮事項
- 金融商品取引法への準拠
- 免責事項の明記
- プライバシーポリシー
- 利用規約
- データ利用に関する許諾

## 今後の拡張計画
- 仮想通貨対応
- 海外株式対応
- ソーシャル機能
- 教育コンテンツ
- API公開
