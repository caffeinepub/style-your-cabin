interface Props {
  muscleGroup: string;
  exerciseName: string;
  isResting?: boolean;
}

export default function AvatarTrainer({
  muscleGroup,
  exerciseName,
  isResting = false,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.15); }
        }
        @keyframes bgShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* ABS — torso crunch */
        @keyframes abs-torso {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(16deg) translateY(4px); }
        }
        @keyframes abs-legs {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-20deg) translateY(-5px); }
        }

        /* ARMS — curl */
        @keyframes arms-left {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(-75deg); }
        }
        @keyframes arms-right {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(75deg); }
        }

        /* CHEST — push-up bob */
        @keyframes chest-left {
          0%, 100% { transform: rotate(30deg); }
          50% { transform: rotate(88deg); }
        }
        @keyframes chest-right {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(-88deg); }
        }
        @keyframes chest-body {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(9px); }
        }

        /* SHOULDERS — overhead press */
        @keyframes shoulders-left {
          0%, 100% { transform: rotate(30deg); }
          50% { transform: rotate(-105deg); }
        }
        @keyframes shoulders-right {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(105deg); }
        }

        /* LEGS — squat */
        @keyframes legs-body {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(18px); }
        }
        @keyframes legs-left {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(42deg); }
        }
        @keyframes legs-right {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(-42deg); }
        }

        /* FULL BODY — jumping jack */
        @keyframes fb-arms-left {
          0%, 100% { transform: rotate(10deg); }
          50% { transform: rotate(-135deg); }
        }
        @keyframes fb-arms-right {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(135deg); }
        }
        @keyframes fb-legs-left {
          0%, 100% { transform: rotate(5deg); }
          50% { transform: rotate(36deg); }
        }
        @keyframes fb-legs-right {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(-36deg); }
        }
        @keyframes fb-body {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        /* Idle breathing */
        @keyframes idle-breathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.04); }
        }
      `}</style>

      {/* Gym background card */}
      <div
        className="relative w-full rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          minHeight: 280,
          background:
            "linear-gradient(135deg, #0F1519 0%, #141B20 40%, #1A1200 100%)",
          backgroundSize: "200% 200%",
          animation: "bgShift 8s ease-in-out infinite",
        }}
      >
        {/* Animated orange glow blob */}
        <div
          className="absolute rounded-full"
          style={{
            width: 260,
            height: 260,
            background:
              "radial-gradient(circle, rgba(255,122,26,0.18) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "glowPulse 2.4s ease-in-out infinite",
          }}
        />

        {/* Floor mat */}
        <div
          className="absolute bottom-0 left-1/2"
          style={{
            transform: "translateX(-50%)",
            width: 180,
            height: 16,
            background: "linear-gradient(90deg, #263038, #FF7A1A22, #263038)",
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            filter: "blur(2px)",
          }}
        />

        {/* SVG Stick Figure */}
        <svg
          role="img"
          aria-label={`Avatar performing ${exerciseName}`}
          width={160}
          height={200}
          viewBox="0 0 100 125"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Shadow under feet */}
          <ellipse cx="50" cy="120" rx="18" ry="3" fill="rgba(0,0,0,0.35)" />

          {/* HEAD */}
          <circle cx="50" cy="12" r="10" fill="#FF7A1A" />
          <circle cx="46" cy="11" r="1.5" fill="#0B0F12" />
          <circle cx="54" cy="11" r="1.5" fill="#0B0F12" />
          <path
            d="M46 15 Q50 18 54 15"
            stroke="#0B0F12"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* NECK */}
          <rect x="47" y="21" width="6" height="5" rx="2" fill="#D85F16" />

          {/* BODY group */}
          <g
            style={{
              transformOrigin: "50px 26px",
              animation: isResting
                ? "idle-breathe 3s ease-in-out infinite"
                : muscleGroup === "abs"
                  ? "abs-torso 1.6s ease-in-out infinite"
                  : muscleGroup === "chest"
                    ? "chest-body 1.4s ease-in-out infinite"
                    : muscleGroup === "full_body"
                      ? "fb-body 1.2s ease-in-out infinite"
                      : muscleGroup === "legs"
                        ? "legs-body 1.6s ease-in-out infinite"
                        : "idle-breathe 3s ease-in-out infinite",
            }}
          >
            {/* Torso */}
            <rect x="38" y="26" width="24" height="28" rx="5" fill="#FF7A1A" />
            <line
              x1="50"
              y1="29"
              x2="50"
              y2="52"
              stroke="#D85F16"
              strokeWidth="1.5"
            />
            <line
              x1="40"
              y1="36"
              x2="60"
              y2="36"
              stroke="#D85F16"
              strokeWidth="1"
            />

            {muscleGroup === "abs" && (
              <>
                <rect
                  x="43"
                  y="40"
                  width="5"
                  height="4"
                  rx="1"
                  fill="#D85F16"
                  opacity="0.85"
                />
                <rect
                  x="52"
                  y="40"
                  width="5"
                  height="4"
                  rx="1"
                  fill="#D85F16"
                  opacity="0.85"
                />
                <rect
                  x="43"
                  y="46"
                  width="5"
                  height="4"
                  rx="1"
                  fill="#D85F16"
                  opacity="0.85"
                />
                <rect
                  x="52"
                  y="46"
                  width="5"
                  height="4"
                  rx="1"
                  fill="#D85F16"
                  opacity="0.85"
                />
              </>
            )}

            {/* LEFT ARM */}
            <g
              style={{
                transformOrigin: "38px 30px",
                animation: isResting
                  ? "none"
                  : muscleGroup === "arms"
                    ? "arms-left 1.4s ease-in-out infinite"
                    : muscleGroup === "chest"
                      ? "chest-left 1.4s ease-in-out infinite"
                      : muscleGroup === "shoulders"
                        ? "shoulders-left 1.6s ease-in-out infinite"
                        : muscleGroup === "full_body"
                          ? "fb-arms-left 1.2s ease-in-out infinite"
                          : "none",
              }}
            >
              <rect x="26" y="28" width="12" height="6" rx="3" fill="#FF7A1A" />
              <rect
                x="16"
                y="28"
                width="12"
                height="5"
                rx="2.5"
                fill="#D85F16"
              />
              <circle cx="14" cy="30" r="4" fill="#FF7A1A" />
            </g>

            {/* RIGHT ARM */}
            <g
              style={{
                transformOrigin: "62px 30px",
                animation: isResting
                  ? "none"
                  : muscleGroup === "arms"
                    ? "arms-right 1.4s ease-in-out infinite"
                    : muscleGroup === "chest"
                      ? "chest-right 1.4s ease-in-out infinite"
                      : muscleGroup === "shoulders"
                        ? "shoulders-right 1.6s ease-in-out infinite"
                        : muscleGroup === "full_body"
                          ? "fb-arms-right 1.2s ease-in-out infinite"
                          : "none",
              }}
            >
              <rect x="62" y="28" width="12" height="6" rx="3" fill="#FF7A1A" />
              <rect
                x="72"
                y="28"
                width="12"
                height="5"
                rx="2.5"
                fill="#D85F16"
              />
              <circle cx="86" cy="30" r="4" fill="#FF7A1A" />
            </g>
          </g>

          {/* LEGS group */}
          <g
            style={{
              transformOrigin: "50px 55px",
              animation:
                muscleGroup === "abs" && !isResting
                  ? "abs-legs 1.6s ease-in-out infinite"
                  : "none",
            }}
          >
            {/* LEFT LEG */}
            <g
              style={{
                transformOrigin: "44px 55px",
                animation: isResting
                  ? "none"
                  : muscleGroup === "legs"
                    ? "legs-left 1.6s ease-in-out infinite"
                    : muscleGroup === "full_body"
                      ? "fb-legs-left 1.2s ease-in-out infinite"
                      : "none",
              }}
            >
              <rect
                x="39"
                y="54"
                width="10"
                height="24"
                rx="5"
                fill="#263038"
              />
              <rect x="40" y="76" width="8" height="18" rx="4" fill="#1A2228" />
              <ellipse cx="42" cy="96" rx="6" ry="3" fill="#FF7A1A" />
            </g>

            {/* RIGHT LEG */}
            <g
              style={{
                transformOrigin: "56px 55px",
                animation: isResting
                  ? "none"
                  : muscleGroup === "legs"
                    ? "legs-right 1.6s ease-in-out infinite"
                    : muscleGroup === "full_body"
                      ? "fb-legs-right 1.2s ease-in-out infinite"
                      : "none",
              }}
            >
              <rect
                x="51"
                y="54"
                width="10"
                height="24"
                rx="5"
                fill="#263038"
              />
              <rect x="52" y="76" width="8" height="18" rx="4" fill="#1A2228" />
              <ellipse cx="58" cy="96" rx="6" ry="3" fill="#FF7A1A" />
            </g>
          </g>
        </svg>

        {/* Rest overlay */}
        {isResting && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F1519]/60 rounded-2xl">
            <div className="text-center">
              <p className="text-4xl mb-1">😮‍💨</p>
              <p className="text-[#FF7A1A] font-bold text-sm uppercase tracking-widest">
                Rest
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-[#FF7A1A] font-bold text-base uppercase tracking-wider">
          {isResting ? "Rest Period" : exerciseName}
        </p>
        <p className="text-[#9AA4AD] text-xs capitalize mt-0.5">
          {muscleGroup.replace("_", " ")} workout
        </p>
      </div>
    </div>
  );
}
