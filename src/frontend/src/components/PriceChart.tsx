import { useRef, useState } from "react";
import type { AssetState } from "../types";
import { change24h, formatPrice } from "../utils/simulation";

interface OHLCCandle {
  open: number;
  high: number;
  low: number;
  close: number;
  index: number;
}

interface Props {
  assetState: AssetState;
  assetName: string;
}

function buildCandles(history: number[], groupSize = 5): OHLCCandle[] {
  const candles: OHLCCandle[] = [];
  for (let i = 0; i + groupSize <= history.length; i += groupSize) {
    const slice = history.slice(i, i + groupSize);
    candles.push({
      open: slice[0],
      high: Math.max(...slice),
      low: Math.min(...slice),
      close: slice[slice.length - 1],
      index: candles.length,
    });
  }
  return candles;
}

export default function PriceChart({ assetState, assetName }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    price: number;
    idx: number;
  } | null>(null);
  const [candleTooltip, setCandleTooltip] = useState<{
    x: number;
    candle: OHLCCandle;
  } | null>(null);
  const [chartMode, setChartMode] = useState<"line" | "candles">("line");

  const W = 600;
  const H = 160;
  const PADX = 8;
  const PADY = 12;
  const history = assetState.history;
  if (history.length < 2) return null;

  const chg = change24h(assetState);
  const isUp = chg >= 0;
  const lineColor = isUp ? "#39D98A" : "#FF5A5F";
  const gradId = `grad-${assetState.symbol}`;

  // ---- Line chart helpers ----
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const getX = (i: number) =>
    PADX + (i / (history.length - 1)) * (W - PADX * 2);
  const getY = (v: number) => PADY + (1 - (v - min) / range) * (H - PADY * 2);

  const points = history.map((v, i) => [getX(i), getY(v)] as [number, number]);
  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");

  const areaPath = [
    `M ${points[0][0]},${H - PADY}`,
    ...points.map(([x, y]) => `L ${x},${y}`),
    `L ${points[points.length - 1][0]},${H - PADY}`,
    "Z",
  ].join(" ");

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(
      ((mx - PADX) / (W - PADX * 2)) * (history.length - 1),
    );
    const clampedIdx = Math.max(0, Math.min(history.length - 1, idx));
    setTooltip({
      x: points[clampedIdx][0],
      y: points[clampedIdx][1],
      price: history[clampedIdx],
      idx: clampedIdx,
    });
  };

  // ---- Candle chart helpers ----
  const candles = buildCandles(history, 5);
  const allValues = candles.flatMap((c) => [c.high, c.low]);
  const candleMin = Math.min(...allValues);
  const candleMax = Math.max(...allValues);
  const candleRange = candleMax - candleMin || 1;

  const getCandleX = (idx: number) =>
    PADX + ((idx + 0.5) / candles.length) * (W - PADX * 2);
  const getCandleY = (v: number) =>
    PADY + (1 - (v - candleMin) / candleRange) * (H - PADY * 2);
  const candleW = Math.max(
    4,
    Math.min(12, ((W - PADX * 2) / candles.length) * 0.6),
  );

  const handleCandleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.floor(((mx - PADX) / (W - PADX * 2)) * candles.length);
    const clampedIdx = Math.max(0, Math.min(candles.length - 1, idx));
    setCandleTooltip({
      x: getCandleX(clampedIdx),
      candle: candles[clampedIdx],
    });
  };

  return (
    <div className="w-full" data-ocid="dashboard.chart_point">
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <span className="font-bold text-white font-mono">
            {assetState.symbol}
          </span>
          <span className="text-[#6B8899] text-sm ml-2">{assetName}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Chart mode toggle */}
          <div
            style={{ background: "#0B1220", border: "1px solid #2A3A4A" }}
            className="flex rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setChartMode("line")}
              style={{
                background: chartMode === "line" ? "#39D98A22" : "transparent",
                color: chartMode === "line" ? "#39D98A" : "#6B8899",
                borderRight: "1px solid #2A3A4A",
              }}
              className="px-2 py-1 text-[11px] font-bold transition-all"
            >
              📈 Line
            </button>
            <button
              type="button"
              onClick={() => setChartMode("candles")}
              style={{
                background:
                  chartMode === "candles" ? "#F5B94222" : "transparent",
                color: chartMode === "candles" ? "#F5B942" : "#6B8899",
              }}
              className="px-2 py-1 text-[11px] font-bold transition-all"
            >
              🕯 Candles
            </button>
          </div>
          <div className="text-right">
            <div className="font-bold text-white font-mono">
              ${formatPrice(assetState.price)}
            </div>
            <div style={{ color: lineColor }} className="text-xs font-semibold">
              {chg >= 0 ? "+" : ""}
              {chg.toFixed(2)}% 24h
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full" style={{ paddingBottom: "28%" }}>
        {chartMode === "line" ? (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip(null)}
            aria-label={`${assetState.symbol} price chart`}
            role="img"
          >
            <title>{assetState.symbol} price chart</title>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((frac) => (
              <line
                key={frac}
                x1={PADX}
                y1={PADY + frac * (H - PADY * 2)}
                x2={W - PADX}
                y2={PADY + frac * (H - PADY * 2)}
                stroke="#2A3A4A"
                strokeWidth="0.5"
              />
            ))}
            {/* Area fill */}
            <path d={areaPath} fill={`url(#${gradId})`} />
            {/* Line */}
            <polyline
              points={polyline}
              fill="none"
              stroke={lineColor}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Tooltip crosshair */}
            {tooltip && (
              <>
                <line
                  x1={tooltip.x}
                  y1={PADY}
                  x2={tooltip.x}
                  y2={H - PADY}
                  stroke="#3A5A6A"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <circle
                  cx={tooltip.x}
                  cy={tooltip.y}
                  r={4}
                  fill={lineColor}
                  stroke="#121E2D"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            onMouseMove={handleCandleMouseMove}
            onMouseLeave={() => setCandleTooltip(null)}
            aria-label={`${assetState.symbol} candlestick chart`}
            role="img"
          >
            <title>{assetState.symbol} candlestick chart</title>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((frac) => (
              <line
                key={frac}
                x1={PADX}
                y1={PADY + frac * (H - PADY * 2)}
                x2={W - PADX}
                y2={PADY + frac * (H - PADY * 2)}
                stroke="#2A3A4A"
                strokeWidth="0.5"
              />
            ))}
            {/* Candles */}
            {candles.map((c) => {
              const cx = getCandleX(c.index);
              const isGreen = c.close >= c.open;
              const color = isGreen ? "#39D98A" : "#FF5A5F";
              const bodyTop = Math.min(getCandleY(c.open), getCandleY(c.close));
              const bodyBottom = Math.max(
                getCandleY(c.open),
                getCandleY(c.close),
              );
              const bodyHeight = Math.max(1, bodyBottom - bodyTop);
              return (
                <g key={c.index}>
                  {/* Wick */}
                  <line
                    x1={cx}
                    y1={getCandleY(c.high)}
                    x2={cx}
                    y2={getCandleY(c.low)}
                    stroke={color}
                    strokeWidth="1"
                  />
                  {/* Body */}
                  <rect
                    x={cx - candleW / 2}
                    y={bodyTop}
                    width={candleW}
                    height={bodyHeight}
                    fill={color}
                    fillOpacity={isGreen ? 0.85 : 0.85}
                    rx="1"
                  />
                </g>
              );
            })}
            {/* Crosshair */}
            {candleTooltip && (
              <line
                x1={candleTooltip.x}
                y1={PADY}
                x2={candleTooltip.x}
                y2={H - PADY}
                stroke="#3A5A6A"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
            )}
          </svg>
        )}

        {/* Line chart tooltip box */}
        {chartMode === "line" && tooltip && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: "8px",
              right: "8px",
              background: "#121E2D",
              border: "1px solid #2A3A4A",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              color: "white",
              fontFamily: "monospace",
              zIndex: 10,
            }}
          >
            <span style={{ color: "#6B8899" }}>pt {tooltip.idx + 1}: </span>$
            {formatPrice(tooltip.price)}
          </div>
        )}

        {/* Candle tooltip box */}
        {chartMode === "candles" && candleTooltip && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: "8px",
              right: "8px",
              background: "#121E2D",
              border: "1px solid #2A3A4A",
              borderRadius: "6px",
              padding: "6px 10px",
              fontSize: "11px",
              color: "white",
              fontFamily: "monospace",
              zIndex: 10,
              minWidth: "120px",
            }}
          >
            <div
              style={{
                color:
                  candleTooltip.candle.close >= candleTooltip.candle.open
                    ? "#39D98A"
                    : "#FF5A5F",
                fontWeight: 700,
                marginBottom: 2,
              }}
            >
              {candleTooltip.candle.close >= candleTooltip.candle.open
                ? "▲ Bullish"
                : "▼ Bearish"}
            </div>
            <div style={{ color: "#6B8899", marginBottom: 1 }}>
              O:{" "}
              <span style={{ color: "white" }}>
                ${formatPrice(candleTooltip.candle.open)}
              </span>
            </div>
            <div style={{ color: "#6B8899", marginBottom: 1 }}>
              H:{" "}
              <span style={{ color: "#39D98A" }}>
                ${formatPrice(candleTooltip.candle.high)}
              </span>
            </div>
            <div style={{ color: "#6B8899", marginBottom: 1 }}>
              L:{" "}
              <span style={{ color: "#FF5A5F" }}>
                ${formatPrice(candleTooltip.candle.low)}
              </span>
            </div>
            <div style={{ color: "#6B8899" }}>
              C:{" "}
              <span style={{ color: "white" }}>
                ${formatPrice(candleTooltip.candle.close)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
