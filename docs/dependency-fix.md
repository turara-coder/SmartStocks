# SmartStocks - 依存関係修正

## 🔧 依存関係の競合解決

React 19との互換性を確保するため、以下の修正を行いました：

### 修正されたパッケージ

1. **@headlessui/react**: `^1.7.17` → `^2.1.10` (React 19対応)
2. **@radix-ui/react-\***: 最新版に更新 (React 19対応)
3. **lucide-react**: `^0.292.0` → `^0.460.0` (React 19対応)
4. **その他のパッケージ**: React 19互換バージョンに更新

### 削除されたパッケージ

- **yfinance**: Node.js環境では使用不可のため削除
  - 代替として、Yahoo Finance APIの直接呼び出しまたは他のライブラリを使用

## 🚀 インストール手順

以下のコマンドを実行してください：

```bash
# 既存のnode_modulesとpackage-lock.jsonを削除
rm -rf node_modules package-lock.json

# 依存関係を再インストール
npm install

# または、問題が続く場合は強制インストール
npm install --legacy-peer-deps
```

## 📋 注意事項

- React 19の新機能を活用できるよう、最新バージョンに更新
- 一部のライブラリで破壊的変更がある可能性があるため、実装時に確認が必要
- yfinanceの代替として、fetch APIで直接Yahoo Finance APIを呼び出す実装を追加予定

## 🔄 代替実装

yfinanceの代替として、以下のような実装を使用します：

```typescript
// lib/yahoo-finance.ts
export async function getYahooFinanceData(symbol: string) {
  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
  );
  const data = await response.json();
  return data.chart.result[0];
}
```
