import { useState } from "react";
import type { Asset, AssetState, PlayerState } from "../types";
import { formatCurrency, formatPrice } from "../utils/simulation";

interface Props {
  asset: Asset | null;
  assetState: AssetState | null;
  player: PlayerState;
  tradingLocked: boolean;
  tradingStopped?: boolean;
  lockSecondsLeft: number;
  isLive?: boolean;
  onBuy: (symbol: string, qty: number) => void;
  onSell: (symbol: string, qty: number) => void;
}

export default function TradePanel({
  asset,
  assetState,
  player,
  tradingLocked,
  tradingStopped = false,
  lockSecondsLeft,
  isLive = false,
  onBuy,
  onSell,
}: Props) {
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<"BUY" | "SELL">("BUY");
  const [lastAction, setLastAction] = useState<string | null>(null);

  if (!asset || !assetState) {
    return (
      <div
        style={{
          background: "#121E2D",
          border: "1px solid #2A3A4A",
          boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
        }}
        className="rounded-xl p-5 flex flex-col items-center justify-center text-center h-48"
      >
        <div className="text-3xl mb-2">&#128200;</div>
        <div className="text-[#6B8899] text-sm">Select an asset to trade</div>
      </div>
    );
  }

  // Either manual stop or inactivity lock disables trading
  const isBlocked = tradingStopped || tradingLocked;

  const price = assetState.price;
  const total = price * qty;
  const holding = player.holdings[asset.symbol];
  const heldQty = holding?.qty ?? 0;
  const avgCost = holding?.avgPrice ?? 0;
  const unrealizedPnL = heldQty > 0 ? (price - avgCost) * heldQty : 0;
  const canBuy = player.cash >= total && qty > 0 && !isBlocked;
  const canSell = heldQty >= qty && qty > 0 && !isBlocked;

  const handleExecute = () => {
    if (isBlocked) return;
    if (mode === "BUY" && canBuy) {
      onBuy(asset.symbol, qty);
      setLastAction(`Bought ${qty}x ${asset.symbol} @ $${formatPrice(price)}`);
    } else if (mode === "SELL" && canSell) {
      onSell(asset.symbol, qty);
      setLastAction(`Sold ${qty}x ${asset.symbol} @ $${formatPrice(price)}`);
    }
  };

  const maxBuy = isBlocked ? 0 : Math.floor(player.cash / price);
  const isUp = assetState.price >= assetState.prevPrice;
  const priceColor = isUp ? "#39D98A" : "#FF5A5F";
  const showWarning = !tradingLocked && !tradingStopped && lockSecondsLeft < 60;

  // Execute button style
  let execBg = "#2A3A4A";
  let execColor = "#3A5A6A";
  if (!isBlocked) {
    if (mode === "BUY") {
      execBg = canBuy
        ? "linear-gradient(135deg, #39D98A, #2DB872)"
        : "#39D98A44";
      execColor = canBuy ? "#0B1220" : "#6B8899";
    } else {
      execBg = canSell
        ? "linear-gradient(135deg, #FF5A5F, #E0474C)"
        : "#FF5A5F44";
      execColor = canSell ? "#0B1220" : "#6B8899";
    }
  }

  return (
    <div
      style={{
        background: "#121E2D",
        border: "1px solid #2A3A4A",
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.25)",
      }}
      className="rounded-xl p-5"
      data-ocid="dashboard.panel"
    >
      {/* Manually stopped banner — shown above lock banner */}
      {tradingStopped && (
        <div
          data-ocid="trade.error_state"
          style={{
            background: "#F5B94218",
            border: "1px solid #F5B94255",
            color: "#F5B942",
          }}
          className="rounded-lg px-3 py-2 mb-4 text-xs font-bold flex items-center gap-2"
        >
          <span className="text-base">⏸</span>
          <span>Trading Paused — Press Start to resume</span>
        </div>
      )}

      {/* Inactivity lock banner */}
      {!tradingStopped && tradingLocked && (
        <div
          data-ocid="trade.error_state"
          style={{
            background: "#FF5A5F18",
            border: "1px solid #FF5A5F55",
            color: "#FF5A5F",
          }}
          className="rounded-lg px-3 py-2 mb-4 text-xs font-bold flex items-center gap-2"
        >
          <span className="text-base">🔒</span>
          <span>Market Closed — Trading resumes when you make a trade</span>
        </div>
      )}

      {showWarning && (
        <div
          data-ocid="trade.loading_state"
          style={{
            background: "#F5B94218",
            border: "1px solid #F5B94255",
            color: "#F5B942",
          }}
          className="rounded-lg px-3 py-2 mb-4 text-xs font-bold flex items-center gap-2"
        >
          <span className="text-base">⚠️</span>
          <span>
            Trading locks in {lockSecondsLeft}s — make a trade to keep market
            open!
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-mono">
              {asset.symbol}
            </span>
            {/* LIVE / SIM badge */}
            {isLive ? (
              <span
                style={{
                  background: "#39D98A18",
                  color: "#39D98A",
                  border: "1px solid #39D98A44",
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                }}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded font-bold"
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#39D98A",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                LIVE
              </span>
            ) : (
              <span
                style={{
                  background: "#6B889918",
                  color: "#6B8899",
                  border: "1px solid #6B889944",
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                }}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded font-bold"
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#6B8899",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                SIM
              </span>
            )}
          </div>
          <div className="text-[#6B8899] text-xs">{asset.name}</div>
        </div>
        <div className="text-right">
          <div
            style={{ color: priceColor }}
            className="font-bold font-mono text-lg"
          >
            ${formatPrice(price)}
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex mb-4 rounded-lg overflow-hidden border border-[#2A3A4A]">
        <button
          type="button"
          data-ocid="trade.tab"
          onClick={() => setMode("BUY")}
          disabled={isBlocked}
          style={{
            background:
              mode === "BUY" && !isBlocked ? "#39D98A22" : "transparent",
            color: isBlocked
              ? "#3A5A6A"
              : mode === "BUY"
                ? "#39D98A"
                : "#6B8899",
            borderRight: "1px solid #2A3A4A",
          }}
          className="flex-1 py-2 text-sm font-bold transition-all"
        >
          BUY
        </button>
        <button
          type="button"
          data-ocid="trade.tab"
          onClick={() => setMode("SELL")}
          disabled={isBlocked}
          style={{
            background:
              mode === "SELL" && !isBlocked ? "#FF5A5F22" : "transparent",
            color: isBlocked
              ? "#3A5A6A"
              : mode === "SELL"
                ? "#FF5A5F"
                : "#6B8899",
          }}
          className="flex-1 py-2 text-sm font-bold transition-all"
        >
          SELL
        </button>
      </div>

      {/* Holdings info */}
      {heldQty > 0 && (
        <div
          style={{ background: "#0B1220", border: "1px solid #2A3A4A" }}
          className="rounded-lg p-3 mb-4 text-xs"
        >
          <div className="flex justify-between text-[#6B8899]">
            <span>Position</span>
            <span className="text-white font-mono">{heldQty} shares</span>
          </div>
          <div className="flex justify-between text-[#6B8899] mt-1">
            <span>Avg Cost</span>
            <span className="text-white font-mono">
              ${formatPrice(avgCost)}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[#6B8899]">Unrealized P&amp;L</span>
            <span
              style={{ color: unrealizedPnL >= 0 ? "#39D98A" : "#FF5A5F" }}
              className="font-mono font-bold"
            >
              {unrealizedPnL >= 0 ? "+" : ""}
              {formatCurrency(unrealizedPnL)}
            </span>
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mb-3">
        <label
          htmlFor="trade-qty"
          className="text-xs text-[#6B8899] block mb-1"
        >
          Quantity
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isBlocked}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            style={{
              background: "#0B1220",
              border: "1px solid #2A3A4A",
              color: isBlocked ? "#3A5A6A" : "white",
            }}
            className="w-9 h-9 rounded-lg font-bold hover:border-[#39D98A] transition-colors"
          >
            &minus;
          </button>
          <input
            id="trade-qty"
            type="number"
            data-ocid="trade.input"
            value={qty}
            min={1}
            disabled={isBlocked}
            onChange={(e) =>
              setQty(Math.max(1, Number.parseInt(e.target.value) || 1))
            }
            style={{
              background: "#0B1220",
              border: "1px solid #2A3A4A",
              color: isBlocked ? "#3A5A6A" : "white",
            }}
            className="flex-1 text-center font-mono rounded-lg py-2 text-sm focus:outline-none focus:border-[#39D98A]"
          />
          <button
            type="button"
            disabled={isBlocked}
            onClick={() => setQty((q) => q + 1)}
            style={{
              background: "#0B1220",
              border: "1px solid #2A3A4A",
              color: isBlocked ? "#3A5A6A" : "white",
            }}
            className="w-9 h-9 rounded-lg font-bold hover:border-[#39D98A] transition-colors"
          >
            +
          </button>
        </div>
        <div className="flex justify-between text-[10px] text-[#6B8899] mt-1 px-1">
          <span>
            Total:{" "}
            <span className="text-white font-mono">
              {formatCurrency(total)}
            </span>
          </span>
          {mode === "BUY" && <span>Max: {maxBuy}</span>}
          {mode === "SELL" && <span>Held: {heldQty}</span>}
        </div>
      </div>

      {/* Execute */}
      <button
        type="button"
        data-ocid="trade.submit_button"
        onClick={handleExecute}
        disabled={isBlocked || (mode === "BUY" ? !canBuy : !canSell)}
        style={{
          background: execBg,
          color: execColor,
          boxShadow:
            !isBlocked && (mode === "BUY" ? canBuy : canSell)
              ? "0 4px 12px rgba(0,0,0,0.3)"
              : undefined,
        }}
        className="w-full py-3 rounded-xl font-bold text-sm transition-all"
      >
        {tradingStopped
          ? "⏸ Trading Paused"
          : tradingLocked
            ? "🔒 Market Locked"
            : `${mode === "BUY" ? "Buy" : "Sell"} ${asset.symbol}`}
      </button>

      {/* Cash available */}
      <div className="text-center text-[10px] text-[#6B8899] mt-3">
        Cash:{" "}
        <span className="text-white font-mono">
          {formatCurrency(player.cash)}
        </span>
      </div>

      {/* Last action */}
      {lastAction && (
        <div
          data-ocid="trade.success_state"
          style={{
            background: "#39D98A11",
            border: "1px solid #39D98A33",
            color: "#39D98A",
          }}
          className="mt-3 text-center text-xs rounded-lg py-2 font-medium"
        >
          &#10003; {lastAction}
        </div>
      )}
    </div>
  );
}
