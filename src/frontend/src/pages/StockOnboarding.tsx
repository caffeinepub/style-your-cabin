import { useState } from "react";

interface Props {
  onStart: (playerName: string, capital: number) => void;
}

const PRESETS = [
  { label: "$1K", value: 1000 },
  { label: "$10K", value: 10000 },
  { label: "$100K", value: 100000 },
  { label: "$1M", value: 1000000 },
];

function formatCapitalDisplay(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function StockOnboarding({ onStart }: Props) {
  const [name, setName] = useState("");
  const [capital, setCapital] = useState(10000);
  const [capitalInput, setCapitalInput] = useState("10000");
  const [error, setError] = useState("");
  const [capitalError, setCapitalError] = useState("");

  const selectedPreset =
    PRESETS.find((p) => p.value === capital)?.value ?? null;

  const handleCapitalChange = (val: string) => {
    setCapitalInput(val);
    const num = Number(val.replace(/[^0-9]/g, ""));
    if (!Number.isNaN(num)) {
      setCapital(num);
      if (num < 1000) {
        setCapitalError("Minimum starting capital is $1,000");
      } else {
        setCapitalError("");
      }
    }
  };

  const handlePresetClick = (value: number) => {
    setCapital(value);
    setCapitalInput(String(value));
    setCapitalError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your trader name.");
      return;
    }
    if (capital < 1000) {
      setCapitalError("Minimum starting capital is $1,000");
      return;
    }
    onStart(trimmed, capital);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#0B1220" }}
    >
      {/* BG grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#2A3A4A 1px, transparent 1px), linear-gradient(90deg, #2A3A4A 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 text-center w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span
              style={{
                color: "#39D98A",
                textShadow: "0 0 20px rgba(57,217,138,0.4)",
              }}
              className="font-black text-5xl tracking-tight"
            >
              STREET
            </span>
            <span className="font-black text-5xl tracking-tight text-white">
              SIM
            </span>
          </div>
          <p className="text-[#6B8899] text-sm">
            The ultimate stock market trading simulator
          </p>
          <p className="text-[#4A6A7A] text-xs mt-1">
            Real-time prices &middot; Live news &middot; Risk-free trading
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Assets", value: "40+", color: "#F5B942" },
            { label: "News Events", value: "80+", color: "#60A5FA" },
            { label: "Categories", value: "8", color: "#39D98A" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#121E2D",
                border: "1px solid #2A3A4A",
                transition: "all 0.2s",
              }}
              className="rounded-xl p-4 hover:border-[#3A5A6A] hover:shadow-lg"
            >
              <div
                style={{ color: stat.color }}
                className="font-black text-xl font-mono"
              >
                {stat.value}
              </div>
              <div className="text-[#6B8899] text-[10px] mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature list */}
        <div className="grid grid-cols-2 gap-2 text-left mb-6">
          {[
            { icon: "🌍", text: "US, Indian, EU & Asian stocks" },
            { icon: "₿", text: "Crypto: BTC, ETH, BNB, SOL" },
            { icon: "📰", text: "80+ real-life news events" },
            { icon: "🔒", text: "Capital lock timer — trade or lose access" },
          ].map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-2 text-xs text-[#6B8899]"
            >
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ background: "#121E2D", border: "1px solid #2A3A4A" }}
          className="rounded-2xl p-6"
          data-ocid="onboarding.dialog"
        >
          <div className="text-left mb-5">
            <h2 className="font-bold text-white text-lg">Enter the Market</h2>
            <p className="text-[#6B8899] text-sm mt-1">
              Choose your starting capital and trader name. Trade actively or
              lose market access after 3 minutes of inactivity.
            </p>
          </div>

          {/* Trader name */}
          <div className="mb-5">
            <label
              htmlFor="trader-name"
              className="block text-xs text-[#6B8899] mb-2 font-semibold"
            >
              TRADER NAME
            </label>
            <input
              id="trader-name"
              type="text"
              data-ocid="onboarding.input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. GordonGecko"
              style={{
                background: "#0B1220",
                border: `1px solid ${error ? "#FF5A5F" : "#2A3A4A"}`,
                color: "white",
              }}
              className="w-full px-4 py-3 rounded-xl text-sm font-mono placeholder-[#3A5A6A] focus:outline-none focus:border-[#39D98A] transition-colors"
            />
            {error && (
              <div
                data-ocid="onboarding.error_state"
                className="text-[#FF5A5F] text-xs mt-1.5"
              >
                {error}
              </div>
            )}
          </div>

          {/* Starting capital */}
          <div className="mb-5">
            <label
              htmlFor="starting-capital"
              className="block text-xs text-[#6B8899] mb-2 font-semibold"
            >
              STARTING CAPITAL
            </label>

            {/* Preset buttons */}
            <div className="flex gap-2 mb-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  data-ocid="onboarding.toggle"
                  onClick={() => handlePresetClick(preset.value)}
                  style={{
                    background:
                      selectedPreset === preset.value ? "#39D98A22" : "#0B1220",
                    border: `1px solid ${
                      selectedPreset === preset.value ? "#39D98A" : "#2A3A4A"
                    }`,
                    color:
                      selectedPreset === preset.value ? "#39D98A" : "#6B8899",
                    transition: "all 0.15s",
                  }}
                  className="flex-1 py-2 text-xs font-bold rounded-lg hover:border-[#39D98A55]"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Manual input */}
            <input
              id="starting-capital"
              type="number"
              data-ocid="onboarding.capital_input"
              value={capitalInput}
              min={1000}
              max={10000000}
              onChange={(e) => handleCapitalChange(e.target.value)}
              style={{
                background: "#0B1220",
                border: `1px solid ${capitalError ? "#FF5A5F" : "#2A3A4A"}`,
                color: "white",
              }}
              className="w-full px-4 py-3 rounded-xl text-sm font-mono placeholder-[#3A5A6A] focus:outline-none focus:border-[#39D98A] transition-colors"
            />

            {/* Formatted display */}
            <div className="mt-2 text-center">
              <span
                style={{ color: capital >= 1000 ? "#39D98A" : "#FF5A5F" }}
                className="font-black text-2xl font-mono tracking-tight"
              >
                {formatCapitalDisplay(capital)}
              </span>
            </div>

            {capitalError && (
              <div
                data-ocid="onboarding.capital_error_state"
                className="text-[#FF5A5F] text-xs mt-1.5"
              >
                {capitalError}
              </div>
            )}
          </div>

          <button
            type="submit"
            data-ocid="onboarding.submit_button"
            style={{
              background: "linear-gradient(135deg, #39D98A, #2DB872)",
              color: "#0B1220",
            }}
            className="w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg"
          >
            Start Trading
          </button>
        </form>

        {/* Bottom links */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {[
            { icon: "📈", text: "Live price simulation" },
            { icon: "📰", text: "Breaking news events" },
            { icon: "💰", text: "Buy & sell assets" },
            { icon: "🏆", text: "Compete on leaderboard" },
          ].map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-1.5 text-xs text-[#6B8899]"
            >
              <span>{f.icon}</span>
              <span className="hidden sm:inline">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
