import { Toaster } from "@/components/ui/sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import NewsTicker from "../components/NewsTicker";
import { NEWS_POOL } from "../data/assets";
import type {
  AssetState,
  LeaderboardEntry,
  NewsItem,
  PlayerState,
  StockTab,
  Transaction,
} from "../types";
import { LIVE_ELIGIBLE_SYMBOLS, fetchRealPrices } from "../utils/realPrices";
import {
  applyNewsImpact,
  clearFlash,
  formatCurrency,
  initAssetStates,
  tickPrices,
} from "../utils/simulation";
import StockDashboard from "./stocksim/Dashboard";
import Leaderboard from "./stocksim/Leaderboard";
import Markets from "./stocksim/Markets";
import NewsPage from "./stocksim/NewsPage";
import Portfolio from "./stocksim/Portfolio";

const LS_PLAYER = "streetsim_player";
const LS_LEADERBOARD = "streetsim_leaderboard";
const LS_PRICES = "streetsim_prices";

const LOCK_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes
const REAL_PRICE_INTERVAL_MS = 60 * 1000; // 1 minute

function loadPlayer(name: string, capital: number): PlayerState {
  try {
    const s = localStorage.getItem(LS_PLAYER);
    if (s) {
      const p = JSON.parse(s) as PlayerState;
      if (p.playerName === name) return p;
    }
  } catch {
    /* empty */
  }
  return {
    playerName: name,
    cash: capital,
    holdings: {},
    transactions: [],
    startingCash: capital,
  };
}

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const s = localStorage.getItem(LS_LEADERBOARD);
    return s ? (JSON.parse(s) as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}

function loadPrices(): Record<string, AssetState> | null {
  try {
    const s = localStorage.getItem(LS_PRICES);
    if (s) {
      const p = JSON.parse(s) as Record<string, AssetState>;
      if (Object.keys(p).length > 0) return p;
    }
  } catch {
    /* empty */
  }
  return null;
}

interface Props {
  playerName: string;
  startingCapital: number;
  onReset: () => void;
}

export default function StockSimApp({
  playerName,
  startingCapital,
  onReset,
}: Props) {
  const [tab, setTab] = useState<StockTab>("dashboard");
  const [prices, setPrices] = useState<Record<string, AssetState>>(
    () => loadPrices() ?? initAssetStates(),
  );
  const [player, setPlayer] = useState<PlayerState>(() =>
    loadPlayer(playerName, startingCapital),
  );
  const [news, setNews] = useState<NewsItem[]>([]);
  const [leaderboard, setLeaderboard] =
    useState<LeaderboardEntry[]>(loadLeaderboard);

  // Manual stop/start trading
  const [tradingStopped, setTradingStopped] = useState(false);

  // Capital lock timer state
  const [lastTradeTime, setLastTradeTime] = useState<number>(() => Date.now());
  const [lockSecondsLeft, setLockSecondsLeft] = useState<number>(180);
  const tradingLocked = lockSecondsLeft === 0;

  // Real price tracking
  const [liveSymbols, setLiveSymbols] = useState<Set<string>>(new Set());

  const newsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist player state
  useEffect(() => {
    localStorage.setItem(LS_PLAYER, JSON.stringify(player));
  }, [player]);

  // Persist prices
  useEffect(() => {
    localStorage.setItem(LS_PRICES, JSON.stringify(prices));
  }, [prices]);

  // Persist leaderboard
  useEffect(() => {
    localStorage.setItem(LS_LEADERBOARD, JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Lock countdown ticker — every 1 second
  useEffect(() => {
    const id = setInterval(() => {
      const secondsLeft = Math.max(
        0,
        Math.floor((lastTradeTime + LOCK_TIMEOUT_MS - Date.now()) / 1000),
      );
      setLockSecondsLeft(secondsLeft);
    }, 1000);
    return () => clearInterval(id);
  }, [lastTradeTime]);

  // Price tick every 3 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setPrices((prev) => {
        const next = tickPrices(prev);
        // Clear flash after 600ms
        setTimeout(() => setPrices((p) => clearFlash(p)), 600);
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Real price fetch — on mount then every 60s
  useEffect(() => {
    const applyRealPrices = async () => {
      try {
        const realPrices = await fetchRealPrices();
        const symbols = Object.keys(realPrices);
        if (symbols.length === 0) return;
        setPrices((prev) => {
          const next = { ...prev };
          for (const sym of symbols) {
            if (next[sym]) {
              const newPrice = realPrices[sym];
              next[sym] = {
                ...next[sym],
                prevPrice: next[sym].price,
                price: newPrice,
                history: [...next[sym].history.slice(-59), newPrice],
                flashClass:
                  newPrice > next[sym].price
                    ? "up"
                    : newPrice < next[sym].price
                      ? "down"
                      : null,
              };
            }
          }
          return next;
        });
        setLiveSymbols(
          new Set(symbols.filter((s) => LIVE_ELIGIBLE_SYMBOLS.has(s))),
        );
      } catch {
        // silently fall back to simulation
      }
    };
    applyRealPrices();
    const id = setInterval(applyRealPrices, REAL_PRICE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // News events every 30-50 seconds
  const scheduleNews = useCallback(() => {
    const delay = 30000 + Math.random() * 20000;
    newsTimerRef.current = setTimeout(() => {
      const item = NEWS_POOL[Math.floor(Math.random() * NEWS_POOL.length)];
      const newsItem: NewsItem = {
        id: `news-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        headline: item.headline,
        symbol: item.symbol,
        impact: item.impact,
        read: false,
      };
      setNews((prev) => [...prev, newsItem]);
      setPrices((prev) => applyNewsImpact(prev, item.symbol, item.impact));
      toast(
        <div className="flex items-start gap-2">
          <span
            style={{ color: item.impact >= 0 ? "#39D98A" : "#FF5A5F" }}
            className="text-base mt-0.5"
          >
            {item.impact >= 0 ? "\uD83D\uDD3A" : "\uD83D\uDD3B"}
          </span>
          <div>
            <div className="font-bold text-white text-xs">
              {item.symbol} news event
            </div>
            <div className="text-[#A0AEC0] text-xs mt-0.5 leading-relaxed">
              {item.headline.slice(0, 80)}...
            </div>
          </div>
        </div>,
        {
          duration: 6000,
          style: {
            background: "#121E2D",
            border: "1px solid #2A3A4A",
            color: "white",
          },
        },
      );
      scheduleNews();
    }, delay);
  }, []);

  useEffect(() => {
    scheduleNews();
    return () => {
      if (newsTimerRef.current) clearTimeout(newsTimerRef.current);
    };
  }, [scheduleNews]);

  const handleBuy = useCallback(
    (symbol: string, qty: number) => {
      if (tradingStopped || tradingLocked) return;
      setPlayer((prev) => {
        const price = prices[symbol]?.price;
        if (!price) return prev;
        const total = price * qty;
        if (prev.cash < total) return prev;
        const existing = prev.holdings[symbol];
        const newQty = (existing?.qty ?? 0) + qty;
        const newAvg = existing
          ? (existing.avgPrice * existing.qty + price * qty) / newQty
          : price;
        const tx: Transaction = {
          id: `tx-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          symbol,
          type: "BUY",
          qty,
          price,
          total,
        };
        return {
          ...prev,
          cash: prev.cash - total,
          holdings: {
            ...prev.holdings,
            [symbol]: { symbol, qty: newQty, avgPrice: newAvg },
          },
          transactions: [...prev.transactions, tx],
        };
      });
      // Reset trade timer
      setLastTradeTime(Date.now());
    },
    [prices, tradingStopped, tradingLocked],
  );

  const handleSell = useCallback(
    (symbol: string, qty: number) => {
      if (tradingStopped || tradingLocked) return;
      setPlayer((prev) => {
        const price = prices[symbol]?.price;
        if (!price) return prev;
        const existing = prev.holdings[symbol];
        if (!existing || existing.qty < qty) return prev;
        const total = price * qty;
        const realizedPnL = (price - existing.avgPrice) * qty;
        const newQty = existing.qty - qty;
        const newHoldings = { ...prev.holdings };
        if (newQty === 0) delete newHoldings[symbol];
        else newHoldings[symbol] = { ...existing, qty: newQty };
        const tx: Transaction = {
          id: `tx-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          symbol,
          type: "SELL",
          qty,
          price,
          total,
          realizedPnL,
        };
        return {
          ...prev,
          cash: prev.cash + total,
          holdings: newHoldings,
          transactions: [...prev.transactions, tx],
        };
      });
      // Reset trade timer
      setLastTradeTime(Date.now());
    },
    [prices, tradingStopped, tradingLocked],
  );

  const handleSaveScore = useCallback(() => {
    const holdingsValue = Object.values(player.holdings).reduce((sum, h) => {
      const price = prices[h.symbol]?.price ?? 0;
      return sum + h.qty * price;
    }, 0);
    const netWorth = player.cash + holdingsValue;
    const returnPct =
      ((netWorth - player.startingCash) / player.startingCash) * 100;
    const entry: LeaderboardEntry = {
      playerName: player.playerName,
      netWorth,
      returnPct,
      timestamp: Date.now(),
    };
    setLeaderboard((prev) => {
      const filtered = prev.filter((e) => e.playerName !== player.playerName);
      return [...filtered, entry];
    });
    toast.success(`Score saved! ${formatCurrency(netWorth)} net worth`);
  }, [player, prices]);

  const handleSelectMarketAsset = useCallback((symbol: string) => {
    setTab("dashboard");
    // We just switch to dashboard; user can select from there
    // symbol is consumed here to keep the handler
    void symbol;
  }, []);

  const NAV: { id: StockTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "\uD83D\uDCCA" },
    { id: "markets", label: "Markets", icon: "\uD83C\uDFDB\uFE0F" },
    { id: "portfolio", label: "Portfolio", icon: "\uD83D\uDCBC" },
    { id: "news", label: "News", icon: "\uD83D\uDCF0" },
    { id: "leaderboard", label: "Leaders", icon: "\uD83C\uDFC6" },
  ];

  const holdingsValue = Object.values(player.holdings).reduce((sum, h) => {
    const price = prices[h.symbol]?.price ?? 0;
    return sum + h.qty * price;
  }, 0);
  const netWorth = player.cash + holdingsValue;
  const returnPct =
    ((netWorth - player.startingCash) / player.startingCash) * 100;
  const isUp = returnPct >= 0;

  // Derive market status badge — tradingStopped overrides lock state
  const marketStatusBadge = tradingStopped
    ? {
        label: "⏸ Paused",
        bg: "#F5B94222",
        color: "#F5B942",
        border: "#F5B94244",
      }
    : tradingLocked
      ? {
          label: "🔒 Locked",
          bg: "#FF5A5F22",
          color: "#FF5A5F",
          border: "#FF5A5F44",
        }
      : lockSecondsLeft < 60
        ? {
            label: `⚠️ ${lockSecondsLeft}s left`,
            bg: "#F5B94222",
            color: "#F5B942",
            border: "#F5B94244",
          }
        : {
            label: "🟢 Market Open",
            bg: "#39D98A22",
            color: "#39D98A",
            border: "#39D98A33",
          };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0B1220", color: "#E2E8F0" }}
    >
      <Toaster position="top-right" />

      {/* Header */}
      <header
        style={{
          background: "linear-gradient(180deg, #0D1626 0%, #0B1220 100%)",
          borderBottom: "1px solid #2A3A4A",
        }}
        className="sticky top-0 z-40 backdrop-blur"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo + badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <span
                  style={{
                    color: "#39D98A",
                    textShadow: "0 0 20px rgba(57,217,138,0.4)",
                    fontSize: "22px",
                  }}
                  className="font-black tracking-tight"
                >
                  STREET
                </span>
                <span
                  style={{ fontSize: "22px" }}
                  className="font-black tracking-tight text-white"
                >
                  SIM
                </span>
              </div>
              <span
                style={{
                  background: "#39D98A22",
                  color: "#39D98A",
                  border: "1px solid #39D98A33",
                }}
                className="text-[10px] font-bold px-2 py-0.5 rounded font-mono"
              >
                LIVE
              </span>
              {/* Market status badge */}
              <span
                data-ocid="nav.market_status"
                style={{
                  background: marketStatusBadge.bg,
                  color: marketStatusBadge.color,
                  border: `1px solid ${marketStatusBadge.border}`,
                }}
                className="hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded font-mono transition-all"
              >
                {marketStatusBadge.label}
              </span>
            </div>

            {/* Player stats */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <div
                  style={{
                    background: "#121E2D",
                    border: "1px solid #2A3A4A",
                    boxShadow: "0 0 12px rgba(57,217,138,0.08)",
                    transition: "border-color 0.15s",
                  }}
                  className="rounded-lg px-3 py-1.5 hover:border-[#39D98A44]"
                >
                  <span className="text-[#6B8899]">Cash: </span>
                  <span className="text-white font-mono font-bold">
                    {formatCurrency(player.cash)}
                  </span>
                </div>
                <div
                  style={{
                    background: "#121E2D",
                    border: "1px solid #2A3A4A",
                    boxShadow: "0 0 12px rgba(57,217,138,0.08)",
                    transition: "border-color 0.15s",
                  }}
                  className="rounded-lg px-3 py-1.5 hover:border-[#39D98A44]"
                >
                  <span className="text-[#6B8899]">Net Worth: </span>
                  <span className="text-white font-mono font-bold">
                    {formatCurrency(netWorth)}
                  </span>
                </div>
                <div
                  style={{
                    background: "#121E2D",
                    border: `1px solid ${isUp ? "#39D98A33" : "#FF5A5F33"}`,
                    transition: "border-color 0.15s",
                  }}
                  className="rounded-lg px-3 py-1.5"
                >
                  <span
                    style={{ color: isUp ? "#39D98A" : "#FF5A5F" }}
                    className="font-mono font-bold"
                  >
                    {isUp ? "+" : ""}
                    {returnPct.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Stop / Start Trading Button */}
              <button
                type="button"
                data-ocid="trade.toggle"
                onClick={() => setTradingStopped((s) => !s)}
                style={{
                  background: tradingStopped ? "#39D98A18" : "#FF5A5F18",
                  border: `1px solid ${
                    tradingStopped ? "#39D98A55" : "#FF5A5F55"
                  }`,
                  color: tradingStopped ? "#39D98A" : "#FF5A5F",
                }}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
              >
                <span>{tradingStopped ? "▶" : "⏸"}</span>
                <span className="hidden sm:inline">
                  {tradingStopped ? "Start Trading" : "Stop Trading"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <div
                  style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
                  className="text-xs text-[#6B8899] px-2 py-1.5 rounded-lg"
                >
                  👤 {player.playerName}
                </div>
                <button
                  type="button"
                  data-ocid="nav.reset_button"
                  onClick={onReset}
                  style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
                  className="text-xs text-[#6B8899] px-2 py-1.5 rounded-lg hover:border-[#FF5A5F44] hover:text-[#FF5A5F] transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                data-ocid={`nav.${item.id}.link`}
                onClick={() => setTab(item.id)}
                style={{
                  borderBottomColor:
                    tab === item.id ? "#39D98A" : "transparent",
                  color: tab === item.id ? "#39D98A" : "#6B8899",
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all hover:text-white"
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* News Ticker */}
      <NewsTicker news={news} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        {tab === "dashboard" && (
          <StockDashboard
            prices={prices}
            player={player}
            news={news}
            onBuy={handleBuy}
            onSell={handleSell}
            tradingLocked={tradingLocked}
            tradingStopped={tradingStopped}
            lockSecondsLeft={lockSecondsLeft}
            liveSymbols={liveSymbols}
          />
        )}
        {tab === "markets" && (
          <Markets prices={prices} onSelectAsset={handleSelectMarketAsset} />
        )}
        {tab === "portfolio" && <Portfolio player={player} prices={prices} />}
        {tab === "news" && <NewsPage news={news} />}
        {tab === "leaderboard" && (
          <Leaderboard
            entries={leaderboard}
            player={player}
            prices={prices}
            onSave={handleSaveScore}
          />
        )}
      </main>

      {/* Mobile bottom nav */}
      <div
        style={{ background: "#0B1220", borderTop: "1px solid #2A3A4A" }}
        className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
      >
        <div className="flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              data-ocid={`nav.${item.id}.link`}
              onClick={() => setTab(item.id)}
              style={{ color: tab === item.id ? "#39D98A" : "#6B8899" }}
              className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-all"
            >
              <span className="text-base">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className="hidden sm:block text-center py-4 text-[#3A5A6A] text-xs"
        style={{ borderTop: "1px solid #1A2E40" }}
      >
        {new Date().getFullYear()} Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#39D98A] hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
