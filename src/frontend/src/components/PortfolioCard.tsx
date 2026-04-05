import type { PlayerState } from "../types";
import type { AssetState } from "../types";
import { formatCurrency } from "../utils/simulation";

interface Props {
  player: PlayerState;
  prices: Record<string, AssetState>;
}

export default function PortfolioCard({ player, prices }: Props) {
  const holdingsValue = Object.values(player.holdings).reduce((sum, h) => {
    const price = prices[h.symbol]?.price ?? 0;
    return sum + h.qty * price;
  }, 0);

  const netWorth = player.cash + holdingsValue;
  const returnPct =
    ((netWorth - player.startingCash) / player.startingCash) * 100;
  const isUp = returnPct >= 0;

  return (
    <div
      style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
      className="rounded-xl p-4"
      data-ocid="portfolio.card"
    >
      <div className="text-[#6B8899] text-xs font-semibold uppercase tracking-wider mb-3">
        Portfolio
      </div>
      <div className="font-bold text-white text-2xl font-mono">
        {formatCurrency(netWorth)}
      </div>
      <div
        style={{ color: isUp ? "#39D98A" : "#FF5A5F" }}
        className="text-sm font-semibold mt-1"
      >
        {isUp ? "+" : ""}
        {returnPct.toFixed(2)}% overall return
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[#6B8899]">Cash</span>
          <span className="text-white font-mono">
            {formatCurrency(player.cash)}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#6B8899]">Equity</span>
          <span className="text-white font-mono">
            {formatCurrency(holdingsValue)}
          </span>
        </div>
        <div
          style={{ borderTop: "1px solid #2A3A4A" }}
          className="pt-2 flex justify-between text-xs"
        >
          <span className="text-[#6B8899]">Positions</span>
          <span className="text-white">
            {Object.keys(player.holdings).length}
          </span>
        </div>
      </div>
    </div>
  );
}
