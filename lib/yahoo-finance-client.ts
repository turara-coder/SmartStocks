// lib/yahoo-finance-client.ts
// yfinanceの代替として、Yahoo Finance APIを直接呼び出し

interface YahooFinanceQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketOpen: number;
  regularMarketPreviousClose: number;
  regularMarketVolume: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

interface YahooFinanceHistoricalData {
  timestamp: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

interface YahooSearchQuote {
  symbol: string;
  longname?: string;
  shortname?: string;
  typeDisp: string;
  exchange: string;
}

interface YahooSearchResponse {
  quotes: YahooSearchQuote[];
}

interface MarketSummaryItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

class YahooFinanceClient {
  private readonly baseUrl = "https://query1.finance.yahoo.com";

  /**
   * 株価データを取得
   */
  async getQuote(symbol: string): Promise<YahooFinanceQuote | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v7/finance/quote?symbols=${symbol}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; SmartStocks/1.0)",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const quote = data.quoteResponse?.result?.[0];

      if (!quote) {
        return null;
      }

      return {
        symbol: quote.symbol,
        regularMarketPrice: quote.regularMarketPrice || 0,
        regularMarketChange: quote.regularMarketChange || 0,
        regularMarketChangePercent: quote.regularMarketChangePercent || 0,
        regularMarketDayHigh: quote.regularMarketDayHigh || 0,
        regularMarketDayLow: quote.regularMarketDayLow || 0,
        regularMarketOpen: quote.regularMarketOpen || 0,
        regularMarketPreviousClose: quote.regularMarketPreviousClose || 0,
        regularMarketVolume: quote.regularMarketVolume || 0,
        marketCap: quote.marketCap || 0,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
      };
    } catch (error) {
      console.error("Yahoo Finance API error:", error);
      return null;
    }
  }

  /**
   * 履歴データを取得
   */
  async getHistoricalData(
    symbol: string,
    period:
      | "1d"
      | "5d"
      | "1mo"
      | "3mo"
      | "6mo"
      | "1y"
      | "2y"
      | "5y"
      | "10y"
      | "ytd"
      | "max" = "1y",
  ): Promise<YahooFinanceHistoricalData | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v8/finance/chart/${symbol}?range=${period}&interval=1d`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; SmartStocks/1.0)",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const result = data.chart?.result?.[0];

      if (!result) {
        return null;
      }

      const quotes = result.indicators?.quote?.[0];
      if (!quotes) {
        return null;
      }

      return {
        timestamp: result.timestamp || [],
        open: quotes.open || [],
        high: quotes.high || [],
        low: quotes.low || [],
        close: quotes.close || [],
        volume: quotes.volume || [],
      };
    } catch (error) {
      console.error("Yahoo Finance historical data error:", error);
      return null;
    }
  }

  /**
   * 銘柄検索
   */
  async searchSymbols(query: string): Promise<
    Array<{
      symbol: string;
      name: string;
      type: string;
      exchange: string;
    }>
  > {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/finance/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; SmartStocks/1.0)",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: YahooSearchResponse = await response.json();
      const quotes = data.quotes || [];

      return quotes
        .filter((quote: YahooSearchQuote) => quote.typeDisp === "Equity")
        .map((quote: YahooSearchQuote) => ({
          symbol: quote.symbol,
          name: quote.longname || quote.shortname || "",
          type: quote.typeDisp,
          exchange: quote.exchange,
        }))
        .slice(0, 10); // 最大10件
    } catch (error) {
      console.error("Yahoo Finance search error:", error);
      return [];
    }
  }

  /**
   * 為替レート取得
   */
  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number | null> {
    try {
      const symbol = `${fromCurrency}${toCurrency}=X`;
      const quote = await this.getQuote(symbol);
      return quote?.regularMarketPrice || null;
    } catch (error) {
      console.error("Exchange rate error:", error);
      return null;
    }
  }

  /**
   * 市場サマリー取得
   */
  async getMarketSummary(): Promise<MarketSummaryItem[]> {
    try {
      const indices = ["^DJI", "^GSPC", "^IXIC", "^N225"]; // Dow, S&P 500, NASDAQ, Nikkei
      const promises = indices.map((symbol) => this.getQuote(symbol));
      const results = await Promise.all(promises);

      const names = ["Dow Jones", "S&P 500", "NASDAQ", "Nikkei 225"];

      return results
        .map((quote, index) => {
          if (!quote) return null;
          return {
            symbol: quote.symbol,
            name: names[index],
            price: quote.regularMarketPrice,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
          };
        })
        .filter((item): item is MarketSummaryItem => item !== null);
    } catch (error) {
      console.error("Market summary error:", error);
      return [];
    }
  }
}

export const yahooFinanceClient = new YahooFinanceClient();
export default yahooFinanceClient;
