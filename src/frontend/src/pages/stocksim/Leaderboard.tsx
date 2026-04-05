import type { AssetState, LeaderboardEntry, PlayerState } from "../../types";
import { formatCurrency } from "../../utils/simulation";

interface Props {
  entries: LeaderboardEntry[];
  player: PlayerState;
  prices: Record<string, AssetState>;
  onSave: () => void;
}

export default function Leaderboard({
  entries,
  player,
  prices,
  onSave,
}: Props) {
  const holdingsValue = Object.values(player.holdings).reduce((sum, h) => {
    const price = prices[h.symbol]?.price ?? 0;
    return sum + h.qty * price;
  }, 0);
  const netWorth = player.cash + holdingsValue;
  const returnPct =
    ((netWorth - player.startingCash) / player.startingCash) * 100;

  const sorted = [...entries].sort((a, b) => b.netWorth - a.netWorth);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-6" data-ocid="leaderboard.section">
      {/* Your Score */}
      <div
        style={{ background: "#121E2D", border: "1px solid #39D98A44" }}
        className="rounded-xl p-5"
        data-ocid="leaderboard.card"
      >
        <div className="text-[#6B8899] text-xs font-semibold uppercase tracking-wider mb-3">
          Your Score
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-xl">
              {player.playerName}
            </div>
            <div className="text-[#6B8899] text-sm mt-1">
              {player.transactions.length} trades
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-white font-mono text-2xl">
              {formatCurrency(netWorth)}
            </div>
            <div
              style={{ color: returnPct >= 0 ? "#39D98A" : "#FF5A5F" }}
              className="font-semibold text-sm"
            >
              {returnPct >= 0 ? "+" : ""}
              {returnPct.toFixed(2)}%
            </div>
          </div>
        </div>
        <button
          type="button"
          data-ocid="leaderboard.save_button"
          onClick={onSave}
          style={{ background: "#39D98A", color: "#0B1220" }}
          className="mt-4 w-full py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Save Score to Leaderboard
        </button>
      </div>

      {/* Rankings */}
      <div>
        <div className="text-[#6B8899] text-xs font-semibold uppercase tracking-wider mb-3">
          Top Traders
        </div>
        {sorted.length === 0 ? (
          <div
            data-ocid="leaderboard.empty_state"
            style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
            className="rounded-xl p-8 text-center text-[#6B8899] text-sm"
          >
            No scores yet. Save your score to start the leaderboard!
          </div>
        ) : (
          <div
            style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
            className="rounded-xl overflow-hidden"
          >
            {sorted.map((entry: LeaderboardEntry, i) => (
              <div
                key={`${entry.playerName}-${entry.timestamp}`}
                data-ocid={`leaderboard.item.${i + 1}`}
                style={{
                  borderBottom:
                    i < sorted.length - 1 ? "1px solid #1A2E40" : undefined,
                  background:
                    entry.playerName === player.playerName
                      ? "#1A2E4022"
                      : undefined,
                }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[#1A2E4022] transition-colors"
              >
                <div className="w-8 text-lg text-center">
                  {medals[i] ?? (
                    <span className="text-[#6B8899] font-mono text-sm">
                      #{i + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">{entry.playerName}</div>
                  <div className="text-[#6B8899] text-xs">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white font-mono">
                    {formatCurrency(entry.netWorth)}
                  </div>
                  <div
                    style={{
                      color: entry.returnPct >= 0 ? "#39D98A" : "#FF5A5F",
                    }}
                    className="text-xs font-semibold"
                  >
                    {entry.returnPct >= 0 ? "+" : ""}
                    {entry.returnPct.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
