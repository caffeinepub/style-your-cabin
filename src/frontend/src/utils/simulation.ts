import { INITIAL_ASSETS } from "../data/assets";
import type { AssetState } from "../types";

export function initAssetStates(): Record<string, AssetState> {
  const states: Record<string, AssetState> = {};
  for (const asset of INITIAL_ASSETS) {
    const p = asset.basePrice;
    // Build 60 initial history points with small random walk
    const history: number[] = [p];
    for (let i = 1; i < 60; i++) {
      const prev = history[i - 1];
      history.push(prev * (1 + (Math.random() * 0.004 - 0.002)));
    }
    states[asset.symbol] = {
      symbol: asset.symbol,
      price: history[history.length - 1],
      prevPrice: history[history.length - 2],
      openPrice: history[0],
      history,
      flashClass: null,
    };
  }
  return states;
}

export function tickPrices(
  states: Record<string, AssetState>,
): Record<string, AssetState> {
  const next: Record<string, AssetState> = {};
  for (const sym of Object.keys(states)) {
    const s = states[sym];
    const newPrice = s.price * (1 + Math.random() * 0.004 - 0.002);
    const newHistory = [...s.history.slice(-59), newPrice];
    next[sym] = {
      ...s,
      prevPrice: s.price,
      price: newPrice,
      history: newHistory,
      flashClass: newPrice > s.price ? "up" : "down",
    };
  }
  return next;
}

export function applyNewsImpact(
  states: Record<string, AssetState>,
  symbol: string,
  impact: number,
): Record<string, AssetState> {
  if (!states[symbol]) return states;
  const s = states[symbol];
  const newPrice = s.price * (1 + impact);
  const newHistory = [...s.history.slice(-59), newPrice];
  return {
    ...states,
    [symbol]: {
      ...s,
      prevPrice: s.price,
      price: newPrice,
      history: newHistory,
      flashClass: impact >= 0 ? "up" : "down",
    },
  };
}

export function clearFlash(
  states: Record<string, AssetState>,
): Record<string, AssetState> {
  const next: Record<string, AssetState> = {};
  for (const sym of Object.keys(states)) {
    next[sym] = { ...states[sym], flashClass: null };
  }
  return next;
}

export function change24h(s: AssetState): number {
  if (s.openPrice === 0) return 0;
  return ((s.price - s.openPrice) / s.openPrice) * 100;
}

export function formatPrice(price: number): string {
  if (price >= 1000) return price.toFixed(2);
  if (price >= 100) return price.toFixed(2);
  return price.toFixed(2);
}

export function formatPct(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function formatCurrency(val: number): string {
  return val.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
