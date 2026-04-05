import type { NewsItem } from "../../types";

interface Props {
  news: NewsItem[];
}

export default function NewsPage({ news }: Props) {
  const sorted = [...news].reverse();

  return (
    <div className="space-y-4" data-ocid="news.section">
      <div className="text-[#6B8899] text-xs font-semibold uppercase tracking-wider">
        Market News Feed
      </div>

      {sorted.length === 0 ? (
        <div
          data-ocid="news.empty_state"
          style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
          className="rounded-xl p-8 text-center text-[#6B8899] text-sm"
        >
          No news yet. The market is quiet — for now.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item: NewsItem, i) => {
            const isPositive = item.impact >= 0;
            const impactColor = isPositive ? "#39D98A" : "#FF5A5F";
            const impactBg = isPositive ? "#39D98A11" : "#FF5A5F11";
            const impactBorder = isPositive ? "#39D98A33" : "#FF5A5F33";

            return (
              <div
                key={item.id}
                data-ocid={`news.item.${i + 1}`}
                style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
                className="rounded-xl p-4 hover:border-[#3A5A6A] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        style={{ background: "#1E3A5F", color: "#60A5FA" }}
                        className="text-xs font-bold px-2 py-0.5 rounded font-mono"
                      >
                        {item.symbol}
                      </span>
                      <span className="text-[#6B8899] text-xs">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                      {item.headline}
                    </p>
                  </div>

                  <div
                    style={{
                      background: impactBg,
                      border: `1px solid ${impactBorder}`,
                      color: impactColor,
                    }}
                    className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-lg font-mono min-w-[60px] text-center"
                  >
                    {isPositive ? "+" : ""}
                    {(item.impact * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
