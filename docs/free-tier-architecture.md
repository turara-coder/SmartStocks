# SmartStocks 無料構成アーキテクチャ

## 概要

SmartStocksアプリを**完全無料**で運用するためのアーキテクチャ設計です。各サービスの無料枠を最大限活用し、維持費ゼロでの運用を実現します。

## 🆓 無料サービス構成

### フロントエンド・ホスティング
**Vercel（無料枠）**
- 静的サイトホスティング: 無制限
- Serverless Functions: 100GB-hours/月
- 帯域幅: 100GB/月
- カスタムドメイン: 1つ
- SSL証明書: 自動提供

###### 期待される効果

### コスト削減
- **従来構成**: $50-100/月
- **無料構成**: $2-8/月（GPT-5/GPT-4o使用時）
- **削減率**: 90%以上

### 機能向上
- GPT-5の高度な推論能力による質の高いキャラクター対話
- より自然で一貫性のある感情表現
- コンテキスト理解の向上upabase（無料枠）**
- PostgreSQL データベース: 500MB
- リアルタイム機能: 2つのデータベース接続
- 認証: 50,000 MAU（月間アクティブユーザー）
- ストレージ: 1GB
- 帯域幅: 2GB/月
- Edge Functions: 500,000実行/月

### キャッシュ・セッション管理
**Vercel KV（無料枠）**
- Redis互換ストレージ: 256MB
- 月間リクエスト: 30,000回
- 日次リクエスト: 1,000回

### 外部API（無料枠）
**Alpha Vantage（無料枠）**
- 株価データ: 500リクエスト/日
- 機能: リアルタイム株価、履歴データ、テクニカル指標

**yfinance（完全無料）**
- Yahoo Finance データ: 無制限（スクレイピング）
- フォールバック・補完データソース

**NewsAPI（無料枠）**
- ニュースデータ: 1,000リクエスト/日
- 過去30日間のニュース

**FRED API（完全無料）**
- 経済指標データ: 無制限
- FRB公式データ

**OpenAI GPT-5（将来）/ GPT-4o（現在・従量課金）**
- 推定コスト: $2-8/月（GPT-5使用時は効率性向上でコスト削減期待）
- GPT-5: 未発表（高性能・高効率を期待）
- GPT-4o: 1,000トークン: $0.005-0.015
- フォールバック: 事前作成テンプレート

### CDN・セキュリティ
**Cloudflare（無料枠）**
- CDN: 無制限
- DDoS保護: 基本レベル
- SSL/TLS暗号化: 自動
- DNS管理: 無料

### 監視・分析
**Vercel Analytics（無料枠）**
- ページビュー: 2,500/月
- コアWebバイタル
- 基本的なユーザー分析

**GitHub Actions（無料枠）**
- CI/CD: 2,000分/月
- プライベートリポジトリ: 500MB

## 🎯 コスト最適化戦略

### 1. API使用量管理
```typescript
// API制限管理例
const API_LIMITS = {
  alphaVantage: { daily: 500, current: 0 },
  newsApi: { daily: 1000, current: 0 },
  openai: { monthly: 1000000, current: 0 } // トークン数
};

// フォールバック戦略
const getStockData = async (symbol: string) => {
  if (API_LIMITS.alphaVantage.current < API_LIMITS.alphaVantage.daily) {
    return await alphaVantageAPI(symbol);
  }
  // フォールバック: yfinance使用
  return await yfinanceAPI(symbol);
};
```

### 2. キャッシュ戦略
```typescript
// Vercel KV キャッシュ最適化
const CACHE_STRATEGIES = {
  stockPrices: { ttl: 300, key: 'stock:${symbol}' }, // 5分
  newArticles: { ttl: 1800, key: 'news:${date}' },   // 30分
  userSessions: { ttl: 86400, key: 'session:${id}' }  // 24時間
};
```

### 3. データベース容量管理
```sql
-- データ自動削除（古いデータ）
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- 30日以上古い株価データを削除
  DELETE FROM stock_prices 
  WHERE date < NOW() - INTERVAL '30 days';
  
  -- 7日以上古いチャット履歴を削除（重要でないもの）
  DELETE FROM chat_histories 
  WHERE created_at < NOW() - INTERVAL '7 days'
  AND importance_level < 3;
END;
$$ LANGUAGE plpgsql;
```

### 4. OpenAI コスト削減・最適化
```typescript
// GPT-5 / GPT-4o使用量最適化
const generateReiDialogue = async (context: string, importance: 'low' | 'medium' | 'high') => {
  // 重要度に応じたモデル選択
  const model = getOptimalModel(importance);
  
  // GPT-5の高効率を活用したトークン設定
  const maxTokens = model === 'gpt-5' ? 200 : 150;
  
  // 簡潔で効果的なプロンプト設計
  const prompt = `れい: ${context.slice(0, 300)}に自然に反応して`;
  
  // フォールバック: 使用量制限チェック
  if (dailyOpenAIUsage > getUsageLimit()) {
    return getTemplateDialogue(context);
  }
  
  try {
    return await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7
    });
  } catch (error) {
    // モデルフォールバック
    return await fallbackGeneration(context, model);
  }
};

const getOptimalModel = (importance: string): string => {
  // GPT-5が利用可能かチェック
  if (isGPT5Available() && importance === 'high') {
    return 'gpt-5';
  }
  // フォールバック順序: GPT-5 → GPT-4o → GPT-4-turbo
  return isGPT4oAvailable() ? 'gpt-4o' : 'gpt-4-turbo';
};
```

## 📊 無料枠制限と対策

### Supabase制限対策
| 制限項目 | 無料枠 | 対策 |
|---------|--------|------|
| DB容量 | 500MB | 古いデータ自動削除、画像はCloudinary無料枠使用 |
| 帯域幅 | 2GB/月 | データ圧縮、画像最適化、CDN活用 |
| 同時接続 | 2つ | 接続プール最適化、適切な接続管理 |

### Vercel制限対策
| 制限項目 | 無料枠 | 対策 |
|---------|--------|------|
| 実行時間 | 10秒 | API応答時間最適化、バックグラウンド処理分離 |
| 実行回数 | 100GB-hours | 効率的な関数設計、不要な実行削減 |
| 帯域幅 | 100GB | 画像最適化、Next.js最適化機能活用 |

### API制限対策
| API | 制限 | 対策 |
|-----|------|------|
| Alpha Vantage | 500req/日 | キャッシュ活用、yfinanceフォールバック |
| NewsAPI | 1000req/日 | RSS併用、キャッシュ最適化 |
| OpenAI | 従量課金 | テンプレート併用、使用量監視 |

## 🚀 スケーラビリティ戦略

### Phase 1: 無料枠内運用（0-100ユーザー）
- 全サービス無料枠で運用
- 基本機能提供
- ユーザーフィードバック収集

### Phase 2: 部分的有料化（100-1000ユーザー）
- Supabase Pro: $25/月（2GB DB）
- OpenAI使用量増加: $5-10/月
- 合計維持費: $30-35/月

### Phase 3: 本格運用（1000+ユーザー）
- 収益化実装（広告、サブスクリプション）
- インフラスケールアップ
- 専用サービス導入検討

## 📈 監視・アラート設定

### 使用量監視
```typescript
// 使用量監視システム
const monitorUsage = async () => {
  const usage = {
    supabase: await getSupabaseUsage(),
    vercel: await getVercelUsage(),
    apis: await getAPIUsage()
  };
  
  // 80%到達でアラート
  if (usage.supabase.storage > 400) { // 400MB/500MB
    await sendAlert('Supabase容量警告');
  }
  
  if (usage.apis.alphaVantage > 400) { // 400req/500req
    await switchToFallbackAPI();
  }
};
```

### 自動調整機能
```typescript
// 自動フォールバック
const adaptiveAPISelection = (requestType: string) => {
  const current = getCurrentUsage();
  
  if (current.alphaVantage > LIMITS.alphaVantage * 0.9) {
    return 'yfinance'; // フォールバック
  }
  
  if (current.openai > LIMITS.openai * 0.8) {
    return 'template'; // テンプレート使用
  }
  
  return 'primary'; // 通常API使用
};
```

## 📋 実装チェックリスト

### インフラ設定
- [ ] Vercel プロジェクト作成・設定
- [ ] Supabase プロジェクト作成・設定
- [ ] Vercel KV 作成・設定
- [ ] Cloudflare 設定（DNS・プロキシ）
- [ ] GitHub Actions CI/CD設定

### API設定
- [ ] Alpha Vantage APIキー取得
- [ ] NewsAPI キー取得
- [ ] OpenAI APIキー取得・使用量制限設定
- [ ] FRED API 確認

### 監視設定
- [ ] 使用量監視システム実装
- [ ] アラート機能実装
- [ ] 自動フォールバック機能実装
- [ ] ログ・分析設定

### 最適化実装
- [ ] データベース自動クリーンアップ
- [ ] キャッシュ戦略実装
- [ ] 画像・アセット最適化
- [ ] API使用量管理システム

## 🎉 期待される効果

### コスト削減
- **従来構成**: $50-100/月
- **無料構成**: $0-5/月（OpenAIのみ）
- **削減率**: 95%以上

### 機能維持
- 全ての計画機能を実装可能
- パフォーマンス低下は最小限
- スケーラビリティも確保

### リスク管理
- 複数のフォールバック戦略
- 段階的なスケールアップ計画
- 監視・アラートシステム

この構成により、SmartStocksアプリを**ほぼ完全無料**で運用することが可能です。
