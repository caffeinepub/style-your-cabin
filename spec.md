# StockSim – Stop/Start Trading & Real Stock Prices

## Current State
- StockSim is a standalone trading simulation app with 40+ simulated assets
- Prices are randomly simulated every 3 seconds using `tickPrices()` in `utils/simulation.ts`
- There is an automatic capital lock timer (3 minutes of inactivity locks trading)
- The TradePanel has BUY/SELL toggle buttons
- Header shows market status badge (Open / Warning / Locked)
- No manual stop/start button exists
- No real-time stock price fetching from external APIs

## Requested Changes (Diff)

### Add
- **Manual Stop/Start Trading button** in the header or trade panel: a prominent toggle button that lets the user pause all trading activity (no buys/sells allowed) and resume it again — same account, same portfolio, just trading paused/resumed
- **Real-life stock price integration**: Fetch live/real prices for US stocks (AAPL, TSLA, GOOG, NVDA, MSFT, AMZN, JPM, NFLX, META) and commodities (Gold XAU, Silver XAG, Crude Oil WTI) using a free public API (e.g. Yahoo Finance unofficial endpoint or Alpha Vantage free tier or Finnhub free tier). For crypto (BTC, ETH, BNB, SOL), use CoinGecko free API. For Indian stocks (TCS, RELI, INFY, WIPRO, HDFC) and European/Asian stocks, use simulated prices seeded from realistic base prices since free APIs rarely cover those.
- **"LIVE" vs "SIM" badge** per asset card or in header to show which assets have real prices vs simulated
- A `useRealPrices` hook or similar that fetches real prices on mount and refreshes every 60 seconds, merging them into the price state alongside simulated assets

### Modify
- `StockSimApp.tsx`: Add `tradingStopped` state (boolean). Pass it down to TradePanel, Dashboard. When stopped, buying and selling are blocked. Add a Stop/Start button to the header.
- `TradePanel.tsx`: Respect `tradingStopped` prop — show a "Trading Paused" banner and disable all trade actions when stopped
- Market status badge in header: show "⏸️ Paused" state when user manually stops trading
- `utils/simulation.ts` or new `utils/realPrices.ts`: Add function to fetch and cache real prices from free public APIs
- Asset cards: subtly indicate LIVE vs SIM data

### Remove
- Nothing removed

## Implementation Plan
1. Add `tradingStopped` boolean state to `StockSimApp.tsx`
2. Add a prominent Stop/Start toggle button in the header (next to existing badges)
3. Pass `tradingStopped` to `TradePanel` and `StockDashboard` components
4. Update `TradePanel` to show a "⏸️ Trading Paused" banner and disable buttons when `tradingStopped === true`
5. Update header market status badge to show Paused state
6. Create `utils/realPrices.ts` that fetches:
   - US stocks + crypto via Yahoo Finance unofficial quote endpoint (no API key, CORS-friendly via proxy or direct)
   - Or use `https://query1.finance.yahoo.com/v8/finance/spark?symbols=AAPL,TSLA,...` (free, no key)
   - Alternatively use Finnhub free tier or CoinGecko for crypto
7. Merge fetched real prices into the simulation state on mount and every 60s
8. Add a small "LIVE" indicator badge on asset cards/price displays that use real data
9. Keep simulation running for assets without real price data (Indian, European, Asian stocks)
