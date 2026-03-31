import { Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import type { HealthStats, UserProfile, WeeklyLogEntry } from "../types";

interface Props {
  profile: UserProfile;
  stats: HealthStats;
  weeklyLogs: WeeklyLogEntry[];
  onUpdateWeekly: (logs: WeeklyLogEntry[]) => void;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function BarChart({
  data,
  max,
  color,
  label,
}: { data: number[]; max: number; color: string; label: string }) {
  return (
    <div className="bg-[#1A2228] rounded-xl p-4">
      <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-3">
        {label}
      </p>
      <div className="flex items-end gap-1 h-24">
        {data.map((val, i) => (
          <div
            key={DAY_LABELS[i]}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <span className="text-xs text-[#9AA4AD]">{val > 0 ? val : ""}</span>
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: `${max > 0 ? (val / max) * 72 : 4}px`,
                backgroundColor: val > 0 ? color : "#263038",
                minHeight: "4px",
              }}
            />
            <span className="text-xs text-[#6F7A84]">{DAY_LABELS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatComparison({
  label,
  starting,
  current,
  unit,
}: { label: string; starting: number; current: number; unit: string }) {
  const diff = current - starting;
  const improved = diff < 0; // lower is better for weight/waist/hip
  const unchanged = diff === 0;
  return (
    <div className="flex items-center justify-between p-3 bg-[#1A2228] rounded-xl">
      <div className="text-center">
        <p className="text-[#9AA4AD] text-xs mb-1">Starting</p>
        <p className="text-[#F2F4F6] font-bold text-lg">
          {starting}
          {unit}
        </p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-[#9AA4AD] text-xs font-semibold uppercase tracking-wider">
          {label}
        </p>
        <span className="text-[#9AA4AD] text-xl">→</span>
        {!unchanged && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: improved
                ? "rgba(34,197,94,0.15)"
                : "rgba(239,68,68,0.15)",
              color: improved ? "#22c55e" : "#ef4444",
            }}
          >
            {diff > 0 ? "+" : ""}
            {diff.toFixed(1)}
            {unit}
          </span>
        )}
        {unchanged && <span className="text-xs text-[#6F7A84]">No change</span>}
      </div>
      <div className="text-center">
        <p className="text-[#9AA4AD] text-xs mb-1">Current</p>
        <p
          className="font-bold text-lg"
          style={{
            color: improved ? "#22c55e" : unchanged ? "#F2F4F6" : "#ef4444",
          }}
        >
          {current}
          {unit}
        </p>
      </div>
    </div>
  );
}

export default function ProgressTab({
  profile,
  stats,
  weeklyLogs,
  onUpdateWeekly,
}: Props) {
  const [newWeight, setNewWeight] = useState("");
  const [newHip, setNewHip] = useState("");
  const [newWaist, setNewWaist] = useState("");
  const [showInput, setShowInput] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const logEntry = weeklyLogs.find((l) => l.date === dateStr);
    return {
      date: dateStr,
      calories: logEntry?.calories ?? 0,
      water: logEntry?.water ?? 0,
      workouts: logEntry?.workouts ?? 0,
      weight: logEntry?.weight ?? 0,
      hip: logEntry?.hip ?? 0,
      waist: logEntry?.waist ?? 0,
    };
  });

  const calData = last7.map((d) => d.calories);
  const waterData = last7.map((d) => d.water);
  const workoutData = last7.map((d) => d.workouts);
  const hipData = last7.map((d) => d.hip);
  const waistData = last7.map((d) => d.waist);

  const nonZeroCals = calData.filter((c) => c > 0);
  const nonZeroWater = waterData.filter((w) => w > 0);
  const avgCals =
    nonZeroCals.length > 0
      ? nonZeroCals.reduce((a, b) => a + b, 0) / nonZeroCals.length
      : 0;
  const totalWorkouts = workoutData.reduce((a, b) => a + b, 0);
  const avgWater =
    nonZeroWater.length > 0
      ? nonZeroWater.reduce((a, b) => a + b, 0) / nonZeroWater.length
      : 0;

  const todayEntry = weeklyLogs.find((l) => l.date === today);
  const currentWeight =
    todayEntry?.weight && todayEntry.weight > 0
      ? todayEntry.weight
      : profile.startingWeight || profile.weight;
  const currentHip =
    todayEntry?.hip && todayEntry.hip > 0 ? todayEntry.hip : profile.hip;
  const currentWaist =
    todayEntry?.waist && todayEntry.waist > 0
      ? todayEntry.waist
      : profile.waist;

  const logBodyStats = () => {
    const w = Number(newWeight);
    const h = Number(newHip);
    const ws = Number(newWaist);
    if (!w || w < 20 || w > 300) return;
    const existing = weeklyLogs.find((l) => l.date === today);
    const updated = weeklyLogs.filter((l) => l.date !== today);
    updated.push({
      date: today,
      calories: existing?.calories ?? 0,
      water: existing?.water ?? 0,
      workouts: existing?.workouts ?? 0,
      weight: w,
      hip: h > 0 ? h : existing?.hip,
      waist: ws > 0 ? ws : existing?.waist,
    });
    onUpdateWeekly(updated);
    setNewWeight("");
    setNewHip("");
    setNewWaist("");
    setShowInput(false);
  };

  // Weekly report helpers
  const weekStart = last7[0].date;
  const weekEnd = last7[6].date;
  const calCompliantDays = calData.filter(
    (c) => c > 0 && c <= stats.targetCalories * 1.1,
  ).length;
  const waterGoalDays = waterData.filter((w) => w >= stats.waterGlasses).length;
  const weekWeights = last7.filter((d) => d.weight > 0).map((d) => d.weight);
  const weightChange =
    weekWeights.length >= 2
      ? weekWeights[weekWeights.length - 1] - weekWeights[0]
      : 0;

  return (
    <div className="space-y-4">
      {/* Starting vs Current Comparison */}
      {(profile.startingWeight > 0 || profile.hip > 0 || profile.waist > 0) && (
        <div className="bg-[#141B20] border border-[#FF7A1A]/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🏆</span>
            <p className="text-xs font-semibold text-[#FF7A1A] uppercase tracking-wider">
              Before vs Current
            </p>
          </div>
          <div className="space-y-3">
            {profile.startingWeight > 0 && (
              <StatComparison
                label="Weight"
                starting={profile.startingWeight}
                current={currentWeight}
                unit="kg"
              />
            )}
            {profile.waist > 0 && (
              <StatComparison
                label="Waist"
                starting={profile.waist}
                current={currentWaist}
                unit="cm"
              />
            )}
            {profile.hip > 0 && (
              <StatComparison
                label="Hip"
                starting={profile.hip}
                current={currentHip}
                unit="cm"
              />
            )}
          </div>
        </div>
      )}

      {/* Weekly Summary */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#FF7A1A]" />
          <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider">
            Weekly Summary
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Avg Calories",
              value: avgCals > 0 ? `${Math.round(avgCals)}` : "—",
              sub: `/ ${stats.targetCalories} target`,
              color: "#FF7A1A",
            },
            {
              label: "Workouts Done",
              value: `${totalWorkouts}`,
              sub: "this week",
              color: "#22c55e",
            },
            {
              label: "Avg Water",
              value: avgWater > 0 ? `${Math.round(avgWater)}` : "—",
              sub: `/ ${stats.waterGlasses} glasses`,
              color: "#3AA0FF",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#1A2228] rounded-xl p-3 text-center"
            >
              <p className="font-bold text-2xl" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[#9AA4AD] text-xs">{s.label}</p>
              <p className="text-[#6F7A84] text-xs">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Body Log */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider">
            Daily Body Stats
          </p>
          <button
            type="button"
            data-ocid="progress.open_modal_button"
            onClick={() => setShowInput(!showInput)}
            className="flex items-center gap-1 bg-[#FF7A1A]/20 border border-[#FF7A1A]/40 text-[#FF7A1A] rounded-full px-3 py-1.5 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Log Today
          </button>
        </div>
        {showInput && (
          <div className="space-y-3 mb-4 bg-[#1A2228] border border-[#263038] rounded-xl p-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label
                  htmlFor="log-weight"
                  className="block text-xs text-[#9AA4AD] mb-1"
                >
                  Weight (kg)*
                </label>
                <input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="kg"
                  id="log-weight"
                  data-ocid="progress.input"
                  className="w-full bg-[#0B0F12] border border-[#263038] rounded-xl px-3 py-2 text-[#F2F4F6] placeholder-[#6F7A84] focus:outline-none focus:border-[#FF7A1A] text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="log-hip"
                  className="block text-xs text-[#9AA4AD] mb-1"
                >
                  Hip (cm)
                </label>
                <input
                  type="number"
                  value={newHip}
                  onChange={(e) => setNewHip(e.target.value)}
                  id="log-hip"
                  placeholder="cm"
                  className="w-full bg-[#0B0F12] border border-[#263038] rounded-xl px-3 py-2 text-[#F2F4F6] placeholder-[#6F7A84] focus:outline-none focus:border-[#FF7A1A] text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="log-waist"
                  className="block text-xs text-[#9AA4AD] mb-1"
                >
                  Waist (cm)
                </label>
                <input
                  type="number"
                  value={newWaist}
                  onChange={(e) => setNewWaist(e.target.value)}
                  id="log-waist"
                  placeholder="cm"
                  className="w-full bg-[#0B0F12] border border-[#263038] rounded-xl px-3 py-2 text-[#F2F4F6] placeholder-[#6F7A84] focus:outline-none focus:border-[#FF7A1A] text-sm"
                />
              </div>
            </div>
            <button
              type="button"
              data-ocid="progress.submit_button"
              onClick={logBodyStats}
              className="w-full bg-[#FF7A1A] hover:bg-[#D85F16] text-white rounded-xl px-4 py-2.5 text-sm font-bold"
            >
              Save Stats
            </button>
          </div>
        )}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[#9AA4AD] text-xs">Starting Weight</p>
            <p className="text-2xl font-bold text-[#F2F4F6]">
              {profile.startingWeight || profile.weight} kg
            </p>
          </div>
          <div className="text-[#9AA4AD] text-2xl">→</div>
          <div>
            <p className="text-[#9AA4AD] text-xs">Current Weight</p>
            <p className="text-2xl font-bold text-[#FF7A1A]">
              {currentWeight} kg
            </p>
          </div>
          {currentWeight - (profile.startingWeight || profile.weight) !== 0 && (
            <div className="ml-auto">
              <p className="text-[#9AA4AD] text-xs">Change</p>
              <p
                className={`text-xl font-bold ${currentWeight < (profile.startingWeight || profile.weight) ? "text-[#22c55e]" : "text-[#ef4444]"}`}
              >
                {currentWeight > (profile.startingWeight || profile.weight)
                  ? "+"
                  : ""}
                {(
                  currentWeight - (profile.startingWeight || profile.weight)
                ).toFixed(1)}{" "}
                kg
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Report Card */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-4">
          📅 Weekly Report
        </p>
        <div className="bg-[#1A2228] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#9AA4AD] text-sm">Period</span>
            <span className="text-[#F2F4F6] text-sm font-medium">
              {weekStart} – {weekEnd}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#9AA4AD] text-sm">Total Workouts</span>
            <span className="text-[#22c55e] font-bold">
              {totalWorkouts}/7 days
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#9AA4AD] text-sm">Calorie Compliance</span>
            <span className="text-[#FF7A1A] font-bold">
              {calCompliantDays}/7 days
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#9AA4AD] text-sm">Water Goal</span>
            <span className="text-[#3AA0FF] font-bold">
              {waterGoalDays}/7 days
            </span>
          </div>
          {weekWeights.length >= 2 && (
            <div className="flex items-center justify-between">
              <span className="text-[#9AA4AD] text-sm">Body Change</span>
              <span
                className="font-bold"
                style={{
                  color:
                    weightChange < 0
                      ? "#22c55e"
                      : weightChange > 0
                        ? "#ef4444"
                        : "#9AA4AD",
                }}
              >
                {weightChange < 0
                  ? `Lost ${Math.abs(weightChange).toFixed(1)}kg this week`
                  : weightChange > 0
                    ? `Gained ${weightChange.toFixed(1)}kg this week`
                    : "Maintained weight"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-4">
          Weekly Charts
        </p>
        <div className="space-y-4">
          <BarChart
            data={calData}
            max={Math.max(...calData, stats.targetCalories)}
            color="#FF7A1A"
            label="Daily Calories (kcal)"
          />
          <BarChart
            data={workoutData}
            max={Math.max(...workoutData, 10)}
            color="#22c55e"
            label="Workouts Completed"
          />
          <BarChart
            data={waterData}
            max={Math.max(...waterData, stats.waterGlasses)}
            color="#3AA0FF"
            label="Water Glasses"
          />
          {hipData.some((v) => v > 0) && (
            <BarChart
              data={hipData}
              max={Math.max(...hipData.filter((v) => v > 0), 120)}
              color="#a855f7"
              label="Hip Size (cm)"
            />
          )}
          {waistData.some((v) => v > 0) && (
            <BarChart
              data={waistData}
              max={Math.max(...waistData.filter((v) => v > 0), 100)}
              color="#f59e0b"
              label="Waist Size (cm)"
            />
          )}
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-4">
          Goal Progress
        </p>
        <div className="space-y-3">
          {[
            {
              label: "Weekly Calorie Goal",
              achieved: calData.filter(
                (c) => c > 0 && c <= stats.targetCalories + 100,
              ).length,
              total: 7,
              color: "#FF7A1A",
            },
            {
              label: "Workout Days This Week",
              achieved: workoutData.filter((w) => w > 0).length,
              total: 5,
              color: "#22c55e",
            },
            {
              label: "Water Goal Days",
              achieved: waterData.filter((w) => w >= stats.waterGlasses).length,
              total: 7,
              color: "#3AA0FF",
            },
          ].map((g) => (
            <div key={g.label}>
              <div className="flex justify-between mb-1">
                <span className="text-[#F2F4F6] text-sm">{g.label}</span>
                <span className="text-sm" style={{ color: g.color }}>
                  {g.achieved}/{g.total} days
                </span>
              </div>
              <div className="h-2 bg-[#263038] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(g.achieved / g.total) * 100}%`,
                    backgroundColor: g.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#141B20] border border-[#263038] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#9AA4AD] uppercase tracking-wider mb-4">
          🔔 Smart Reminders
        </p>
        <div className="space-y-2">
          {[
            {
              label: "Meal Reminder",
              time: "Every 4 hours",
              icon: "🍽️",
              color: "#FF7A1A",
            },
            {
              label: "Water Reminder",
              time: "Every 2 hours",
              icon: "💧",
              color: "#3AA0FF",
            },
            {
              label: "Workout Reminder",
              time: "Daily at 6:00 PM",
              icon: "💪",
              color: "#22c55e",
            },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between p-3 bg-[#1A2228] rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{r.icon}</span>
                <div>
                  <p className="text-[#F2F4F6] text-sm font-medium">
                    {r.label}
                  </p>
                  <p className="text-[#9AA4AD] text-xs">{r.time}</p>
                </div>
              </div>
              <div className="w-10 h-5 bg-[#FF7A1A] rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[#6F7A84] text-xs mt-3">
          Enable browser notifications for real-time reminders
        </p>
      </div>
    </div>
  );
}
