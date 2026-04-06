# StockSim - Candlesticks, Custom Capital & UI Upgrade

## Current State
StockSim is a standalone React stock market simulation game. Users start with $10,000 (hardcoded). The chart is a line chart (`PriceChart.tsx`) showing price history with an area fill and hover tooltip. The onboarding screen (`StockOnboarding.tsx`) has a trader name input but no capital input. The overall dark UI uses `#0B1220` background with `#39D98A` green accents. The `AssetState` type stores `history: number[]` (60 price points).

## Requested Changes (Diff)

### Add
- **Candlestick chart mode**: Toggle between line chart and candlestick (OHLC) chart on the dashboard. Candlesticks built with SVG, showing green (bullish) and red (bearish) candles with wicks. Derive OHLC data from the existing `history` price array by grouping N points per candle.
- **Custom capital input on onboarding**: A numeric input field on the onboarding screen where users can type their own starting capital (min $1,000, max $10,000,000, default $10,000). The chosen amount is passed to `loadPlayer` and stored as `startingCash`.
- **UI upgrade**: More polished look — gradient header, glowing stat cards, improved typography, better card depth with subtle inner shadows, smoother asset card hover states, improved trade panel buttons.

### Modify
- `StockOnboarding.tsx`: Add capital input below trader name. Show preset quick-pick buttons ($1K, $10K, $100K, $1M). Pass capital to `onStart(name, capital)` callback.
- `App.tsx`: Update `onStart` signature to `(name: string, capital: number)`. Pass capital to `StockSimApp`.
- `StockSimApp.tsx`: Accept `startingCapital` prop, use it as `STARTING_CASH` instead of hardcoded value. Update `loadPlayer` call.
- `PriceChart.tsx`: Add chart type toggle (Line | Candles). When candles selected, render SVG candlestick chart derived from history data. Keep line chart as default.
- `loadPlayer` in `StockSimApp.tsx`: Accept capital param, use it for new players.
- Header stat cards: Make them visually richer with glow/border effects. Add gradient backgrounds.
- Asset cards: Improve hover states, add micro-sparkline if space allows.

### Remove
- Nothing removed.

## Implementation Plan
1. **`StockOnboarding.tsx`**: Add `capital` state, numeric input with min/max validation, quick-pick preset buttons ($1K, $10K, $100K, $1M). Update form submit to call `onStart(name, capital)`. Update onboarding stats row to show chosen capital dynamically.
2. **`App.tsx`**: Change `onStart` to `(name: string, capital: number)`. Store capital in localStorage. Pass `startingCapital` to `StockSimApp`.
3. **`StockSimApp.tsx`**: Accept `startingCapital: number` prop. Replace hardcoded `STARTING_CASH = 10000` with prop. Update `loadPlayer(name, startingCapital)`. Clear capital from localStorage on reset.
4. **`PriceChart.tsx`**: Add `CandlestickChart` sub-component using SVG. Group `history` array into OHLC candles (every 4-5 points = 1 candle). Render candle bodies and wicks. Add toggle button (Line/Candles) in chart header. Both charts should support hover tooltip.
5. **UI polish**: Upgrade header with gradient/glow on stat cards. Improve card borders and shadows. Better typography hierarchy.
