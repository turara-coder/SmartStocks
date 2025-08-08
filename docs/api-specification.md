# API仕様書

## 基本情報

- **Base URL**: `https://api.smartstocks.app/v1`
- **認証方式**: JWT Bearer Token
- **データ形式**: JSON
- **文字エンコーディング**: UTF-8

## 認証

### POST /auth/login
ユーザーログイン

#### Request
```json
{
  "email": "hiro@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "email": "hiro@example.com",
      "name": "ひろ",
      "profile": {
        "riskTolerance": "moderate",
        "investmentGoal": "long_term"
      }
    }
  }
}
```

### POST /auth/register
ユーザー登録

### POST /auth/refresh
トークンリフレッシュ

### POST /auth/logout
ログアウト

## 株価データAPI

### GET /stocks/search
銘柄検索

#### Parameters
- `q` (string, required): 検索キーワード
- `limit` (number, optional): 取得件数 (default: 10, max: 50)
- `market` (string, optional): 市場 (TOKYO, NASDAQ, NYSE)

#### Response
```json
{
  "success": true,
  "data": {
    "stocks": [
      {
        "symbol": "7203",
        "name": "トヨタ自動車",
        "market": "TOKYO",
        "currency": "JPY",
        "sector": "自動車・輸送機器",
        "industry": "自動車"
      }
    ],
    "total": 1
  }
}
```

### GET /stocks/{symbol}
個別銘柄情報

#### Response
```json
{
  "success": true,
  "data": {
    "symbol": "7203",
    "name": "トヨタ自動車",
    "market": "TOKYO",
    "currentPrice": 2450.0,
    "change": 25.0,
    "changePercent": 1.03,
    "volume": 1234567,
    "marketCap": 35000000000000,
    "pe": 12.5,
    "pb": 0.8,
    "roe": 6.4,
    "dividend": 220.0,
    "dividendYield": 2.2,
    "updatedAt": "2025-08-08T09:00:00Z"
  }
}
```

### GET /stocks/{symbol}/historical
株価履歴データ

#### Parameters
- `period` (string): 期間 (1d, 5d, 1m, 3m, 6m, 1y, 2y, 5y, max)
- `interval` (string): 間隔 (1m, 5m, 15m, 30m, 1h, 1d, 1w, 1mo)

#### Response
```json
{
  "success": true,
  "data": {
    "symbol": "7203",
    "period": "1m",
    "interval": "1d",
    "prices": [
      {
        "date": "2025-07-08",
        "open": 2400.0,
        "high": 2460.0,
        "low": 2390.0,
        "close": 2450.0,
        "volume": 1234567
      }
    ]
  }
}
```

### GET /stocks/{symbol}/technical
テクニカル指標

#### Response
```json
{
  "success": true,
  "data": {
    "symbol": "7203",
    "indicators": {
      "sma": {
        "5": 2445.0,
        "25": 2420.0,
        "75": 2380.0
      },
      "rsi": 65.2,
      "macd": {
        "macd": 12.5,
        "signal": 10.2,
        "histogram": 2.3
      },
      "bb": {
        "upper": 2500.0,
        "middle": 2450.0,
        "lower": 2400.0
      }
    },
    "updatedAt": "2025-08-08T09:00:00Z"
  }
}
```

## AI分析API

### GET /ai/recommendations
おすすめ銘柄取得

#### Parameters
- `riskLevel` (string): リスクレベル (low, moderate, high)
- `budget` (number): 予算
- `timeHorizon` (string): 投資期間 (short, medium, long)
- `limit` (number): 取得件数

#### Response
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "symbol": "7203",
        "name": "トヨタ自動車",
        "score": 85.5,
        "reason": "業績好調で配当利回りも魅力的です",
        "reiComment": "この銘柄、最近調子いいのよ。ひろも気に入ると思うけど...どうかしら？",
        "riskLevel": "moderate",
        "expectedReturn": 12.5,
        "recommendedWeight": 15.0,
        "tags": ["配当", "安定性", "成長性"]
      }
    ],
    "totalScore": 85.5,
    "marketSentiment": "positive",
    "reiMood": "confident",
    "generatedAt": "2025-08-08T09:00:00Z"
  }
}
```

### POST /ai/analyze
個別銘柄AI分析

#### Request
```json
{
  "symbol": "7203",
  "analysisType": ["technical", "fundamental", "sentiment"]
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "symbol": "7203",
    "analysis": {
      "overall": {
        "score": 78.5,
        "rating": "BUY",
        "confidence": 0.85
      },
      "technical": {
        "score": 75.0,
        "signals": ["golden_cross", "volume_surge"],
        "trend": "upward"
      },
      "fundamental": {
        "score": 82.0,
        "strengths": ["strong_earnings", "low_debt"],
        "weaknesses": ["high_pe"]
      },
      "sentiment": {
        "score": 79.0,
        "newsCount": 15,
        "positiveRatio": 0.73
      }
    },
    "reiComment": "数字を見る限りはなかなか良さそうね。でも、投資は慎重にね、ひろ？"
  }
}
```

## れいキャラクターAPI

### POST /rei/chat
れいとの会話

#### Request
```json
{
  "message": "今日のおすすめ銘柄を教えて",
  "context": {
    "userMood": "curious",
    "marketCondition": "bullish",
    "portfolio": ["7203", "6758"]
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "message": "そうね...今日は特にこの銘柄が気になってるの。ひろはどう思う？",
    "emotion": "shy_confident",
    "animation": "point_gesture",
    "voice": {
      "text": "そうね...今日は特にこの銘柄が気になってるの。ひろはどう思う？",
      "audioUrl": "/audio/rei_20250808_001.mp3"
    },
    "attachments": [
      {
        "type": "stock_recommendation",
        "data": {
          "symbol": "7203",
          "reason": "業績が安定していて..."
        }
      }
    ]
  }
}
```

### GET /rei/status
れいの現在の状態

#### Response
```json
{
  "success": true,
  "data": {
    "mood": "normal",
    "energy": 85,
    "emotions": {
      "affection": 75,
      "shyness": 60,
      "worry": 20,
      "confidence": 80
    },
    "memory": {
      "lastConversation": "2025-08-08T08:30:00Z",
      "favoriteTopics": ["投資戦略", "リスク管理"],
      "userPreferences": {
        "communicationStyle": "gentle",
        "informationLevel": "detailed"
      }
    }
  }
}
```

## ユーザー管理API

### GET /users/profile
ユーザープロフィール取得

### PUT /users/profile
プロフィール更新

### GET /users/watchlist
ウォッチリスト取得

### POST /users/watchlist
ウォッチリスト追加

### DELETE /users/watchlist/{symbol}
ウォッチリスト削除

### GET /users/portfolio
ポートフォリオ取得

### POST /users/portfolio/transactions
取引記録追加

## 通知API

### GET /notifications
通知一覧取得

### POST /notifications/subscribe
プッシュ通知購読

### PUT /notifications/settings
通知設定更新

## 市場データAPI

### GET /market/status
市場状況取得

### GET /market/indices
主要指数取得

### GET /market/news
市場ニュース取得

### GET /market/calendar
経済カレンダー取得

## エラーレスポンス

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "リクエストが無効です",
    "details": [
      {
        "field": "symbol",
        "message": "銘柄コードは必須です"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証が必要です"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "アクセス権限がありません"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "リソースが見つかりません"
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト制限を超えています",
    "retryAfter": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "内部サーバーエラーが発生しました"
  }
}
```

## レート制限

- **認証済みユーザー**: 1000 requests/hour
- **未認証ユーザー**: 100 requests/hour
- **AI分析API**: 50 requests/hour
- **リアルタイムデータ**: 500 requests/hour

## ページング

リスト系APIでは以下の形式でページングをサポート：

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## WebSocket API

### 接続
```
wss://api.smartstocks.app/v1/ws
```

### 認証
```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 株価購読
```json
{
  "type": "subscribe",
  "channel": "stock_price",
  "symbols": ["7203", "6758"]
}
```

### リアルタイムデータ受信
```json
{
  "type": "stock_price_update",
  "data": {
    "symbol": "7203",
    "price": 2455.0,
    "change": 30.0,
    "timestamp": "2025-08-08T09:15:00Z"
  }
}
```
