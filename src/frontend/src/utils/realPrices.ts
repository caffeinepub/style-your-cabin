/**
 * Fetches real-time stock prices from Yahoo Finance (unofficial) and CoinGecko.
 * Falls back gracefully to empty object if any fetch fails.
 */

const STOCK_SYMBOLS = [
  "AAPL",
  "TSLA",
  "GOOG",
  "NVDA",
  "MSFT",
  "AMZN",
  "JPM",
  "NFLX",
  "META",
];

const COINGECKO_MAP: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  binancecoin: "BNB",
  solana: "SOL",
};

async function fetchYahooFinance(): Promise<Record<string, number>> {
  const symbols = STOCK_SYMBOLS.join(",");
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${symbols}&range=1d&interval=5m`,
    `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${symbols}&range=1d&interval=5m`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      // biome-ignore lint/suspicious/noExplicitAny: Yahoo Finance API response shape is unknown
      const data: any = await res.json();
      const sparkResponse = data?.spark?.result ?? [];
      const prices: Record<string, number> = {};
      // biome-ignore lint/suspicious/noExplicitAny: dynamic API shape
      for (const item of sparkResponse as any[]) {
        const symbol: string = item?.symbol;
        // biome-ignore lint/suspicious/noExplicitAny: dynamic API shape
        const closeArr: number[] | undefined = item?.response?.[0]?.indicators
          ?.quote?.[0]?.close as any;
        if (symbol && Array.isArray(closeArr)) {
          const valid = closeArr.filter((v: number | null) => v != null);
          if (valid.length > 0) {
            prices[symbol] = valid[valid.length - 1];
          }
        }
      }
      if (Object.keys(prices).length > 0) return prices;
    } catch {
      // try next URL
    }
  }
  return {};
}

async function fetchCoinGecko(): Promise<Record<string, number>> {
  const ids = Object.keys(COINGECKO_MAP).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return {};
    // biome-ignore lint/suspicious/noExplicitAny: CoinGecko API response shape
    const data: any = await res.json();
    const prices: Record<string, number> = {};
    for (const [geckoId, symbol] of Object.entries(COINGECKO_MAP)) {
      const usd = data?.[geckoId]?.usd;
      if (typeof usd === "number") {
        prices[symbol] = usd;
      }
    }
    return prices;
  } catch {
    return {};
  }
}

/**
 * Fetches real prices for US stocks and major cryptos.
 * Returns a map of symbol -> current price.
 * Returns empty object if all sources fail.
 */
export async function fetchRealPrices(): Promise<Record<string, number>> {
  try {
    const [stockPrices, cryptoPrices] = await Promise.all([
      fetchYahooFinance(),
      fetchCoinGecko(),
    ]);
    return { ...stockPrices, ...cryptoPrices };
  } catch {
    return {};
  }
}

/** Symbols that can have real prices (US stocks + major crypto) */
export const LIVE_ELIGIBLE_SYMBOLS = new Set([
  ...STOCK_SYMBOLS,
  ...Object.values(COINGECKO_MAP),
]);
