import { INITIAL_ASSETS } from "../../data/assets";
import type { AssetState, PlayerState, Transaction } from "../../types";
import { formatCurrency, formatPct, formatPrice } from "../../utils/simulation";

interface Props {
  player: PlayerState;
  prices: Record<string, AssetState>;
}

export default function Portfolio({ player, prices }: Props) {
  const holdings = Object.values(player.holdings);
  const holdingsValue = holdings.reduce((sum, h) => {
    const price = prices[h.symbol]?.price ?? 0;
    return sum + h.qty * price;
  }, 0);
  const netWorth = player.cash + holdingsValue;
  const returnPct =
    ((netWorth - player.startingCash) / player.startingCash) * 100;
  const isUp = returnPct >= 0;

  const recentTx = [...player.transactions].reverse().slice(0, 20);

  return (
    <div className="space-y-6" data-ocid="portfolio.section">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Net Worth",
            value: formatCurrency(netWorth),
            accent: isUp ? "#39D98A" : "#FF5A5F",
          },
          {
            label: "Cash",
            value: formatCurrency(player.cash),
            accent: "#A0AEC0",
          },
          {
            label: "Equity",
            value: formatCurrency(holdingsValue),
            accent: "#F5B942",
          },
          {
            label: "Total Return",
            value: `${isUp ? "+" : ""}${returnPct.toFixed(2)}%`,
            accent: isUp ? "#39D98A" : "#FF5A5F",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
            className="rounded-xl p-4"
          >
            <div className="text-[#6B8899] text-xs mb-1">{item.label}</div>
            <div
              style={{ color: item.accent }}
              className="font-bold font-mono text-base"
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Holdings */}
      <div>
        <div className="text-[#6B8899] text-xs font-semibold uppercase tracking-wider mb-3">
          Open Positions
        </div>
        {holdings.length === 0 ? (
          <div
            data-ocid="portfolio.empty_state"
            style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
            className="rounded-xl p-8 text-center text-[#6B8899] text-sm"
          >
            No open positions. Start trading from the Dashboard!
          </div>
        ) : (
          <div
            style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
            className="rounded-xl overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #2A3A4A",
                    background: "#0B1220",
                  }}
                >
                  <th className="text-left px-4 py-3 text-[#6B8899] font-semibold">
                    Symbol
                  </th>
                  <th className="text-right px-4 py-3 text-[#6B8899] font-semibold">
                    Qty
                  </th>
                  <th className="text-right px-4 py-3 text-[#6B8899] font-semibold hidden sm:table-cell">
                    Avg Cost
                  </th>
                  <th className="text-right px-4 py-3 text-[#6B8899] font-semibold">
                    Price
                  </th>
                  <th className="text-right px-4 py-3 text-[#6B8899] font-semibold">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, i) => {
                  const asset = INITIAL_ASSETS.find(
                    (a) => a.symbol === h.symbol,
                  );
                  const price = prices[h.symbol]?.price ?? 0;
                  const pnl = (price - h.avgPrice) * h.qty;
                  const pnlPct =
                    h.avgPrice > 0
                      ? ((price - h.avgPrice) / h.avgPrice) * 100
                      : 0;
                  const isHoldUp = pnl >= 0;
                  return (
                    <tr
                      key={h.symbol}
                      data-ocid={`portfolio.item.${i + 1}`}
                      style={{ borderBottom: "1px solid #1A2E40" }}
                      className="hover:bg-[#1A2E4022] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-white font-mono">
                          {h.symbol}
                        </div>
                        <div className="text-[#6B8899] text-xs hidden sm:block">
                          {asset?.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-white font-mono">
                        {h.qty}
                      </td>
                      <td className="px-4 py-3 text-right text-[#6B8899] font-mono hidden sm:table-cell">
                        ${formatPrice(h.avgPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-mono">
                        ${formatPrice(price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div
                          style={{ color: isHoldUp ? "#39D98A" : "#FF5A5F" }}
                          className="font-bold font-mono"
                        >
                          {isHoldUp ? "+" : ""}
                          {formatCurrency(pnl)}
                        </div>
                        <div
                          style={{ color: isHoldUp ? "#39D98A" : "#FF5A5F" }}
                          className="text-xs"
                        >
                          {formatPct(pnlPct)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div>
        <div className="text-[#6B8899] text-xs font-semibold uppercase tracking-wider mb-3">
          Transaction History
        </div>
        {recentTx.length === 0 ? (
          <div
            style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
            className="rounded-xl p-6 text-center text-[#6B8899] text-sm"
          >
            No transactions yet.
          </div>
        ) : (
          <div
            style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
            className="rounded-xl overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #2A3A4A",
                    background: "#0B1220",
                  }}
                >
                  <th className="text-left px-4 py-3 text-[#6B8899] font-semibold">
                    Time
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B8899] font-semibold">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B8899] font-semibold">
                    Symbol
                  </th>
                  <th className="text-right px-4 py-3 text-[#6B8899] font-semibold">
                    Qty
                  </th>
                  <th className="text-right px-4 py-3 text-[#6B8899] font-semibold hidden sm:table-cell">
                    Price
                  </th>
                  <th className="text-right px-4 py-3 text-[#6B8899] font-semibold">
                    Total
                  </th>
                  <th className="text-right px-4 py-3 text-[#6B8899] font-semibold hidden sm:table-cell">
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map((tx: Transaction, i) => (
                  <tr
                    key={tx.id}
                    data-ocid={`portfolio.row.${i + 1}`}
                    style={{ borderBottom: "1px solid #1A2E40" }}
                    className="hover:bg-[#1A2E4022] transition-colors"
                  >
                    <td className="px-4 py-3 text-[#6B8899] text-xs">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        style={{
                          background:
                            tx.type === "BUY" ? "#39D98A22" : "#FF5A5F22",
                          color: tx.type === "BUY" ? "#39D98A" : "#FF5A5F",
                        }}
                        className="text-xs font-bold px-2 py-0.5 rounded"
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-white font-mono">
                      {tx.symbol}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-mono">
                      {tx.qty}
                    </td>
                    <td className="px-4 py-3 text-right text-[#6B8899] font-mono hidden sm:table-cell">
                      ${formatPrice(tx.price)}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-mono">
                      {formatCurrency(tx.total)}
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      {tx.realizedPnL !== undefined ? (
                        <span
                          style={{
                            color: tx.realizedPnL >= 0 ? "#39D98A" : "#FF5A5F",
                          }}
                          className="font-mono font-bold"
                        >
                          {tx.realizedPnL >= 0 ? "+" : ""}
                          {formatCurrency(tx.realizedPnL)}
                        </span>
                      ) : (
                        <span className="text-[#6B8899]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
