import type { NewsItem } from "../types";

interface Props {
  news: NewsItem[];
}

export default function NewsTicker({ news }: Props) {
  if (news.length === 0) return null;

  const items = [...news].reverse().slice(0, 10);
  const text = items
    .map((n) => {
      const sign = n.impact >= 0 ? "🔺" : "🔻";
      return `${sign} ${n.symbol}: ${n.headline}`;
    })
    .join("   ·   ");

  return (
    <div className="w-full overflow-hidden bg-[#0D1929] border-b border-[#2A3A4A] py-2">
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          animation: "tickerScroll 60s linear infinite",
        }}
      >
        <span className="text-xs text-[#A0AEC0] font-mono">
          {text}&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </span>
      </div>
    </div>
  );
}
