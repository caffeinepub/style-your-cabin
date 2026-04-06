import { useState } from "react";
import AssetCard from "../../components/AssetCard";
import PortfolioCard from "../../components/PortfolioCard";
import PriceChart from "../../components/PriceChart";
import TradePanel from "../../components/TradePanel";
import { INITIAL_ASSETS } from "../../data/assets";
import type {
  Asset,
  AssetCategory,
  AssetState,
  NewsItem,
  PlayerState,
} from "../../types";

type CategoryFilter = "all" | AssetCategory;

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "us", label: "US Stocks" },
  { id: "indian", label: "\uD83C\uDDEE\uD83C\uDDF3 Indian" },
  { id: "european", label: "\uD83C\uDDEA\uD83C\uDDFA European" },
  { id: "asian", label: "\uD83C\uDF0F Asian" },
  { id: "crypto", label: "\u20BF Crypto" },
  { id: "commodity", label: "\u26CF\uFE0F Commodities" },
];

interface Props {
  prices: Record<string, AssetState>;
  player: PlayerState;
  news: NewsItem[];
  tradingLocked: boolean;
  tradingStopped: boolean;
  lockSecondsLeft: number;
  liveSymbols: Set<string>;
  onBuy: (symbol: string, qty: number) => void;
  onSell: (symbol: string, qty: number) => void;
}

export default function StockDashboard({
  prices,
  player,
  news: _news,
  tradingLocked,
  tradingStopped,
  lockSecondsLeft,
  liveSymbols,
  onBuy,
  onSell,
}: Props) {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const selected =
    INITIAL_ASSETS.find((a) => a.symbol === selectedSymbol) ??
    INITIAL_ASSETS[0];
  const selectedState = prices[selectedSymbol];

  const filteredAssets: Asset[] =
    categoryFilter === "all"
      ? INITIAL_ASSETS
      : INITIAL_ASSETS.filter((a) => a.category === categoryFilter);

  // Group filtered assets by type
  const stocks = filteredAssets.filter((a) => a.type === "stock");
  const cryptos = filteredAssets.filter((a) => a.type === "crypto");
  const commodities = filteredAssets.filter((a) => a.type === "commodity");

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-1 min-w-max">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              data-ocid="dashboard.tab"
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                background: categoryFilter === cat.id ? "#39D98A22" : "#121E2D",
                color: categoryFilter === cat.id ? "#39D98A" : "#6B8899",
                border: `1px solid ${
                  categoryFilter === cat.id ? "#39D98A44" : "#2A3A4A"
                }`,
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Asset Cards */}
        <div className="lg:col-span-1 space-y-4">
          <PortfolioCard player={player} prices={prices} />

          {stocks.length > 0 && (
            <div>
              <div className="text-[#6B8899] text-xs font-semibold uppercase tracking-wider mb-2 px-1">
                Stocks
              </div>
              <div className="grid grid-cols-2 gap-2">
                {stocks.map((asset) => (
                  <AssetCard
                    key={asset.symbol}
                    asset={asset}
                    state={prices[asset.symbol]}
                    selected={selectedSymbol === asset.symbol}
                    isLive={liveSymbols.has(asset.symbol)}
                    onClick={() => setSelectedSymbol(asset.symbol)}
                    onTrade={() => setSelectedSymbol(asset.symbol)}
                  />
                ))}
              </div>
            </div>
          )}

          {cryptos.length > 0 && (
            <div>
              <div className="text-[#6B8899] text-xs font-semibold uppercase tracking-wider mb-2 px-1">
                Crypto
              </div>
              <div className="grid grid-cols-2 gap-2">
                {cryptos.map((asset) => (
                  <AssetCard
                    key={asset.symbol}
                    asset={asset}
                    state={prices[asset.symbol]}
                    selected={selectedSymbol === asset.symbol}
                    isLive={liveSymbols.has(asset.symbol)}
                    onClick={() => setSelectedSymbol(asset.symbol)}
                    onTrade={() => setSelectedSymbol(asset.symbol)}
                  />
                ))}
              </div>
            </div>
          )}

          {commodities.length > 0 && (
            <div>
              <div className="text-[#6B8899] text-xs font-semibold uppercase tracking-wider mb-2 px-1">
                Commodities
              </div>
              <div className="grid grid-cols-2 gap-2">
                {commodities.map((asset) => (
                  <AssetCard
                    key={asset.symbol}
                    asset={asset}
                    state={prices[asset.symbol]}
                    selected={selectedSymbol === asset.symbol}
                    isLive={liveSymbols.has(asset.symbol)}
                    onClick={() => setSelectedSymbol(asset.symbol)}
                    onTrade={() => setSelectedSymbol(asset.symbol)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredAssets.length === 0 && (
            <div
              data-ocid="dashboard.empty_state"
              style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
              className="rounded-xl p-8 text-center text-[#6B8899] text-sm"
            >
              No assets in this category
            </div>
          )}
        </div>

        {/* Right: Chart + Trade */}
        <div className="lg:col-span-2 space-y-4">
          {selectedState && (
            <div
              style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
              className="rounded-xl p-5"
            >
              <PriceChart
                assetState={selectedState}
                assetName={selected.name}
              />
            </div>
          )}

          <TradePanel
            asset={selected}
            assetState={selectedState ?? null}
            player={player}
            tradingLocked={tradingLocked}
            tradingStopped={tradingStopped}
            lockSecondsLeft={lockSecondsLeft}
            isLive={liveSymbols.has(selected.symbol)}
            onBuy={onBuy}
            onSell={onSell}
          />
        </div>
      </div>
    </div>
  );
}
