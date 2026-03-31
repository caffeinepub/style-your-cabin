interface CircularProgressProps {
  value: number;
  max: number;
  label: string;
  sublabel: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  value,
  max,
  label,
  sublabel,
  color = "#FF7A1A",
  size = 120,
  strokeWidth = 10,
}: CircularProgressProps) {
  const pct = Math.min(value / Math.max(max, 1), 1);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          style={{ display: "block" }}
          aria-label={`${label}: ${Math.round(pct * 100)}%`}
          role="img"
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#2A343C"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[#F2F4F6]">
            {Math.round(pct * 100)}%
          </span>
          <span className="text-xs text-[#9AA4AD]">{label}</span>
        </div>
      </div>
      <p className="text-xs text-[#9AA4AD] text-center leading-tight">
        {sublabel}
      </p>
    </div>
  );
}
