import { useRef, useState } from "react";
import type { AssetState } from "../types";
import { change24h, formatPrice } from "../utils/simulation";

interface Props {
  assetState: AssetState;
  assetName: string;
}

export default function PriceChart({ assetState, assetName }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    price: number;
    idx: number;
  } | null>(null);

  const W = 600;
  const H = 160;
  const PADX = 8;
  const PADY = 12;
  const history = assetState.history;
  if (history.length < 2) return null;

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const getX = (i: number) =>
    PADX + (i / (history.length - 1)) * (W - PADX * 2);
  const getY = (v: number) => PADY + (1 - (v - min) / range) * (H - PADY * 2);

  const points = history.map((v, i) => [getX(i), getY(v)] as [number, number]);
  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");

  const chg = change24h(assetState);
  const isUp = chg >= 0;
  const lineColor = isUp ? "#39D98A" : "#FF5A5F";
  const gradId = `grad-${assetState.symbol}`;

  // Area path
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

  return (
    <div className="w-full" data-ocid="dashboard.chart_point">
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <span className="font-bold text-white font-mono">
            {assetState.symbol}
          </span>
          <span className="text-[#6B8899] text-sm ml-2">{assetName}</span>
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

      <div className="relative w-full" style={{ paddingBottom: "28%" }}>
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
        {/* Tooltip box */}
        {tooltip && (
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
      </div>
    </div>
  );
}
