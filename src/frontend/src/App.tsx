import {
  Apple,
  Bot,
  Dumbbell,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AvatarPage from "./components/AvatarPage";
import Dashboard from "./components/Dashboard";
import NutritionTab from "./components/NutritionTab";
import Onboarding from "./components/Onboarding";
import ProgressTab from "./components/ProgressTab";
import WorkoutTab from "./components/WorkoutTab";
import type {
  ActiveTab,
  DailyLog,
  HealthStats,
  UserProfile,
  WeeklyLogEntry,
} from "./types";
import { calculateHealthStats } from "./utils/calculations";
import { generateMealPlan } from "./utils/mealData";
import { getExercisesForTargets } from "./utils/workoutData";

const LS_PROFILE = "sparkfit_profile";
const LS_DAILY = "sparkfit_daily_log";
const LS_WEEKLY = "sparkfit_weekly_logs";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function defaultLog(date: string): DailyLog {
  return {
    date,
    mealsConsumed: [],
    totalCaloriesConsumed: 0,
    totalProteinConsumed: 0,
    waterGlasses: 0,
    workoutsCompleted: [],
  };
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const s = localStorage.getItem(LS_PROFILE);
      return s ? (JSON.parse(s) as UserProfile) : null;
    } catch {
      return null;
    }
  });

  const today = getTodayDate();

  const [dailyLog, setDailyLog] = useState<DailyLog>(() => {
    try {
      const s = localStorage.getItem(LS_DAILY);
      if (s) {
        const log = JSON.parse(s) as DailyLog;
        if (log.date === today) return log;
      }
    } catch {}
    return defaultLog(today);
  });

  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLogEntry[]>(() => {
    try {
      const s = localStorage.getItem(LS_WEEKLY);
      return s ? (JSON.parse(s) as WeeklyLogEntry[]) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  useEffect(() => {
    if (profile) localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LS_DAILY, JSON.stringify(dailyLog));
    setWeeklyLogs((prev) => {
      const updated = prev.filter((l) => l.date !== today);
      const existing = prev.find((l) => l.date === today);
      updated.push({
        date: today,
        calories: dailyLog.totalCaloriesConsumed,
        water: dailyLog.waterGlasses,
        workouts: dailyLog.workoutsCompleted.length,
        weight: existing?.weight ?? profile?.weight ?? 0,
        hip: existing?.hip,
        waist: existing?.waist,
      });
      return updated;
    });
  }, [dailyLog, today, profile?.weight]);

  useEffect(() => {
    localStorage.setItem(LS_WEEKLY, JSON.stringify(weeklyLogs));
  }, [weeklyLogs]);

  const stats = useMemo<HealthStats | null>(
    () => (profile ? calculateHealthStats(profile) : null),
    [profile],
  );

  const meals = useMemo(
    () => (profile && stats ? generateMealPlan(profile, stats) : []),
    [profile, stats],
  );

  const exercises = useMemo(
    () => (profile ? getExercisesForTargets(profile.muscleTargets) : []),
    [profile],
  );

  const handleCompleteOnboarding = useCallback(
    (p: UserProfile) => {
      setProfile(p);
      setDailyLog(defaultLog(today));
    },
    [today],
  );

  const handleUpdateLog = useCallback((log: DailyLog) => {
    setDailyLog(log);
  }, []);

  const handleUpdateWeekly = useCallback((logs: WeeklyLogEntry[]) => {
    setWeeklyLogs(logs);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as ActiveTab);
  }, []);

  const resetProfile = () => {
    localStorage.removeItem(LS_PROFILE);
    localStorage.removeItem(LS_DAILY);
    localStorage.removeItem(LS_WEEKLY);
    setProfile(null);
    setDailyLog(defaultLog(today));
    setWeeklyLogs([]);
  };

  if (!profile || !stats) {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  const NAV_ITEMS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "nutrition",
      label: "Nutrition",
      icon: <Apple className="w-5 h-5" />,
    },
    { id: "workout", label: "Workout", icon: <Dumbbell className="w-5 h-5" /> },
    {
      id: "progress",
      label: "Progress",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: "avatar",
      label: "Avatar",
      icon: <Bot className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F12] text-[#F2F4F6]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F12]/95 backdrop-blur border-b border-[#263038]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/assets/spark-fit-logo.jpeg"
              alt="Spark Fit"
              className="h-10 w-auto object-contain"
            />
            <span className="hidden sm:block text-[#6F7A84] text-xs ml-2">
              {profile.fitnessGoal === "weight_loss"
                ? "🔥 Weight Loss"
                : profile.fitnessGoal === "muscle_building"
                  ? "💪 Muscle Building"
                  : "⚙️ Maintain"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#9AA4AD] bg-[#141B20] border border-[#263038] rounded-full px-3 py-1.5">
              <span className="font-medium text-[#F2F4F6]">
                {profile.weight}kg
              </span>
              <span>•</span>
              <span>{profile.age}y</span>
              <span>•</span>
              <span>BMI {stats.bmi}</span>
            </div>
            <button
              type="button"
              onClick={resetProfile}
              title="Reset Profile"
              className="w-8 h-8 rounded-full bg-[#141B20] border border-[#263038] flex items-center justify-center hover:border-[#FF7A1A]/50 transition-colors"
            >
              <Settings className="w-4 h-4 text-[#9AA4AD]" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.${item.id}.link`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-all ${
                  activeTab === item.id
                    ? "border-[#FF7A1A] text-[#FF7A1A]"
                    : "border-transparent text-[#9AA4AD] hover:text-[#F2F4F6]"
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {activeTab === "dashboard" && (
          <Dashboard
            profile={profile}
            stats={stats}
            log={dailyLog}
            meals={meals}
            exercises={exercises}
            onUpdateLog={handleUpdateLog}
            onTabChange={handleTabChange}
          />
        )}
        {activeTab === "nutrition" && (
          <NutritionTab
            stats={stats}
            meals={meals}
            log={dailyLog}
            onUpdateLog={handleUpdateLog}
          />
        )}
        {activeTab === "workout" && (
          <WorkoutTab
            profile={profile}
            stats={stats}
            log={dailyLog}
            onUpdateLog={handleUpdateLog}
          />
        )}
        {activeTab === "progress" && (
          <ProgressTab
            profile={profile}
            stats={stats}
            weeklyLogs={weeklyLogs}
            onUpdateWeekly={handleUpdateWeekly}
          />
        )}
        {activeTab === "avatar" && <AvatarPage profile={profile} />}
      </main>

      {/* Footer */}
      <footer className="hidden sm:block text-center py-4 text-[#6F7A84] text-xs border-t border-[#263038] pb-6">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF7A1A] hover:underline"
        >
          caffeine.ai
        </a>
      </footer>

      {/* Bottom Mobile Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#0B0F12]/95 backdrop-blur border-t border-[#263038]">
        <div className="flex">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${
                activeTab === item.id ? "text-[#FF7A1A]" : "text-[#6F7A84]"
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
