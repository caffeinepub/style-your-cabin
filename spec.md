# StockSim – Advanced Upgrade

## Current State
- 11 assets: AAPL, TSLA, GOOG, NVDA, MSFT, AMZN, JPM, NFLX, XAU, XAG, WTI
- Prices tick every 3s, news fires every 30-50s
- Basic buy/sell, portfolio, leaderboard, news feed
- No trading limits or lock mechanisms

## Requested Changes (Diff)

### Add
- **Capital lock timer**: After the player hasn't made a trade for N minutes (configurable, default 3 min), trading is locked. A visible countdown shows time remaining. When locked, buy/sell buttons are disabled with a clear "Market Closed" message showing when it reopens. Timer resets on every trade.
- **30+ new companies** across categories:
  - Indian stocks: TATA (Tata Consultancy), RELI (Reliance Industries), INFY (Infosys), WIPRO (Wipro), HDFC (HDFC Bank)
  - European stocks: BMW (BMW Group), SIEM (Siemens), LVMH (LVMH), SAP (SAP SE), NESN (Nestle)
  - Asian stocks: SAMS (Samsung), TOYT (Toyota), SONY (Sony), BABA (Alibaba), BAIDU (Baidu)
  - US extras: META (Meta), DIS (Disney), SBUX (Starbucks), V (Visa), WMT (Walmart)
  - Crypto: BTC (Bitcoin), ETH (Ethereum)
  - More commodities: NAT (Natural Gas), CORN (Corn Futures), CPR (Copper)
- Asset categories now shown in tabs/filters: All, US Stocks, Indian, European, Asian, Crypto, Commodities
- News events for all new companies (positive + negative)
- Onboarding stats updated to show 40+ assets

### Modify
- TradePanel: Show capital lock countdown, disable buy/sell when locked
- StockSimApp: Add trading lock timer logic
- Dashboard: Support asset category filter
- StockOnboarding: Update asset count stat
- assets.ts: Add all new assets and their news
- types.ts: Add tradingLockedUntil to PlayerState

### Remove
- Nothing removed

## Implementation Plan
1. Update types.ts: add tradingLockedUntil field
2. Update assets.ts: add 30+ assets and news events
3. Update simulation.ts: initAssetStates handles new assets automatically
4. Update StockSimApp: add lock timer (resets on every buy/sell, 3 min countdown), pass lockState to TradePanel
5. Update TradePanel: show lock countdown, disable buttons when locked
6. Update Dashboard: asset category filter tabs
7. Update StockOnboarding: show 40+ assets stat
