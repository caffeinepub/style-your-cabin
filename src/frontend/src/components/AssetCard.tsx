import type { Asset, AssetState } from "../types";
import { change24h, formatPct, formatPrice } from "../utils/simulation";

interface Props {
  asset: Asset;
  state: AssetState;
  selected: boolean;
  isLive?: boolean;
  onClick: () => void;
  onTrade: () => void;
}

function Sparkline({ history }: { history: number[] }) {
  if (history.length < 2) return null;
  const W = 80;
  const H = 28;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  });
  const isUp = history[history.length - 1] >= history[0];
  const color = isUp ? "#39D98A" : "#FF5A5F";
  return (
    <svg
      width={W}
      height={H}
      className="flex-shrink-0"
      aria-label="Price sparkline"
      role="img"
    >
      <title>Price sparkline</title>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AssetCard({
  asset,
  state,
  selected,
  isLive = false,
  onClick,
  onTrade,
}: Props) {
  const chg = change24h(state);
  const isUp = chg >= 0;
  const color = isUp ? "#39D98A" : "#FF5A5F";
  const isGold = asset.type === "commodity" && asset.symbol === "XAU";
  const accentColor = isGold ? "#F5B942" : color;

  let flashBg = "";
  if (state.flashClass === "up") flashBg = "rgba(57,217,138,0.08)";
  if (state.flashClass === "down") flashBg = "rgba(255,90,95,0.08)";

  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid="markets.card"
      style={{
        background: selected ? "#1A2E40" : "#121E2D",
        border: `1px solid ${selected ? "#39D98A" : "#2A3A4A"}`,
        boxShadow: selected
          ? "0 0 0 1px #39D98A33"
          : flashBg
            ? `0 0 16px 0 ${flashBg}`
            : undefined,
        transition: "all 0.25s",
        backgroundColor: flashBg && !selected ? flashBg : undefined,
        textAlign: "left",
        width: "100%",
      }}
      className="rounded-xl p-4 cursor-pointer hover:border-[#3A5A6A] transition-all group"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white font-mono text-sm">
              {asset.symbol}
            </span>
            {/* LIVE / SIM badge */}
            {isLive ? (
              <span
                style={{
                  background: "#39D98A18",
                  color: "#39D98A",
                  border: "1px solid #39D98A33",
                  fontSize: "8px",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
                className="flex items-center gap-0.5 px-1 py-0.5 rounded font-bold"
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
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
                  background: "transparent",
                  color: "#4A6A7A",
                  fontSize: "8px",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
                className="flex items-center gap-0.5 px-1 py-0.5 rounded font-bold"
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#4A6A7A",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                SIM
              </span>
            )}
            {asset.type === "commodity" && (
              <span
                style={{ background: "#F5B94222", color: "#F5B942" }}
                className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
              >
                CMDTY
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#6B8899] mt-0.5 truncate max-w-[100px]">
            {asset.name}
          </div>
        </div>
        <Sparkline history={state.history} />
      </div>

      <div className="flex items-end justify-between mt-2">
        <div>
          <div className="font-bold text-white text-lg font-mono leading-none">
            ${formatPrice(state.price)}
          </div>
          <div
            style={{ color: accentColor }}
            className="text-xs font-semibold mt-1"
          >
            {formatPct(chg)}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTrade();
          }}
          data-ocid="markets.trade_button"
          style={{
            background: `${accentColor}22`,
            color: accentColor,
            border: `1px solid ${accentColor}44`,
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Trade
        </button>
      </div>
    </button>
  );
}
