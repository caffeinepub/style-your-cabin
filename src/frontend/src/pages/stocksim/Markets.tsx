import { useState } from "react";
import { INITIAL_ASSETS } from "../../data/assets";
import type { Asset, AssetCategory, AssetState } from "../../types";
import { change24h, formatPct, formatPrice } from "../../utils/simulation";

type CategoryFilter = "all" | AssetCategory;

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All Assets" },
  { id: "us", label: "US Stocks" },
  { id: "indian", label: "🇮🇳 Indian" },
  { id: "european", label: "🇪🇺 European" },
  { id: "asian", label: "🌏 Asian" },
  { id: "crypto", label: "₿ Crypto" },
  { id: "commodity", label: "⛏️ Commodities" },
];

const TYPE_BADGE: Record<string, { bg: string; color: string; label: string }> =
  {
    stock: { bg: "#39D98A11", color: "#39D98A", label: "STOCK" },
    commodity: { bg: "#F5B94222", color: "#F5B942", label: "CMDTY" },
    crypto: { bg: "#60A5FA22", color: "#60A5FA", label: "CRYPTO" },
  };

interface Props {
  prices: Record<string, AssetState>;
  onSelectAsset: (symbol: string) => void;
}

export default function Markets({ prices, onSelectAsset }: Props) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortBy, setSortBy] = useState<"symbol" | "price" | "change">("change");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const assets = INITIAL_ASSETS.filter((a) =>
    categoryFilter === "all" ? true : a.category === categoryFilter,
  );

  const sorted = [...assets].sort((a, b) => {
    const sa = prices[a.symbol];
    const sb = prices[b.symbol];
    let va = 0;
    let vb = 0;
    if (sortBy === "symbol") {
      return sortDir === "asc"
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    }
    if (sortBy === "price") {
      va = sa?.price ?? 0;
      vb = sb?.price ?? 0;
    }
    if (sortBy === "change") {
      va = change24h(sa);
      vb = change24h(sb);
    }
    return sortDir === "asc" ? va - vb : vb - va;
  });

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: typeof sortBy }) => (
    <span className="ml-1 text-[10px]">
      {sortBy === col ? (sortDir === "desc" ? "\u25bc" : "\u25b2") : "\u21c5"}
    </span>
  );

  return (
    <div className="space-y-4" data-ocid="markets.table">
      {/* Category Filters */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-1 min-w-max">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              data-ocid="markets.tab"
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                background: categoryFilter === cat.id ? "#39D98A22" : "#121E2D",
                color: categoryFilter === cat.id ? "#39D98A" : "#6B8899",
                border: `1px solid ${
                  categoryFilter === cat.id ? "#39D98A44" : "#2A3A4A"
                }`,
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
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
              <th
                className="text-left px-4 py-3 text-[#6B8899] font-semibold cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort("symbol")}
                onKeyDown={(e) => e.key === "Enter" && toggleSort("symbol")}
              >
                Symbol <SortIcon col="symbol" />
              </th>
              <th className="text-left px-4 py-3 text-[#6B8899] font-semibold hidden sm:table-cell">
                Name
              </th>
              <th className="text-left px-4 py-3 text-[#6B8899] font-semibold">
                Type
              </th>
              <th
                className="text-right px-4 py-3 text-[#6B8899] font-semibold cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort("price")}
                onKeyDown={(e) => e.key === "Enter" && toggleSort("price")}
              >
                Price <SortIcon col="price" />
              </th>
              <th
                className="text-right px-4 py-3 text-[#6B8899] font-semibold cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort("change")}
                onKeyDown={(e) => e.key === "Enter" && toggleSort("change")}
              >
                24h <SortIcon col="change" />
              </th>
              <th className="text-right px-4 py-3 text-[#6B8899] font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((asset: Asset, i) => {
              const state = prices[asset.symbol];
              const chg = state ? change24h(state) : 0;
              const isUp = chg >= 0;
              const badge = TYPE_BADGE[asset.type] ?? TYPE_BADGE.stock;
              return (
                <tr
                  key={asset.symbol}
                  data-ocid={`markets.item.${i + 1}`}
                  style={{ borderBottom: "1px solid #1A2E40" }}
                  className="hover:bg-[#1A2E4022] transition-colors cursor-pointer"
                  onClick={() => onSelectAsset(asset.symbol)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && onSelectAsset(asset.symbol)
                  }
                  tabIndex={0}
                >
                  <td className="px-4 py-3">
                    <span className="font-bold text-white font-mono">
                      {asset.symbol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B8899] hidden sm:table-cell">
                    {asset.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      style={{
                        background: badge.bg,
                        color: badge.color,
                      }}
                      className="text-xs px-2 py-0.5 rounded font-semibold"
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-white">
                    {state ? `$${formatPrice(state.price)}` : "\u2014"}
                  </td>
                  <td
                    className="px-4 py-3 text-right font-semibold"
                    style={{ color: isUp ? "#39D98A" : "#FF5A5F" }}
                  >
                    {state ? formatPct(chg) : "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      data-ocid="markets.trade_button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAsset(asset.symbol);
                      }}
                      style={{
                        background: "#39D98A22",
                        color: "#39D98A",
                        border: "1px solid #39D98A44",
                      }}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-80"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
