"use client";

interface DonutChartProps {
  score: number | null;
  size?: number;
}

export function DonutChart({ score, size = 120 }: DonutChartProps) {
  if (score === null) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="var(--terminal-border)"
            strokeWidth="20"
          />
          <text
            x="60"
            y="60"
            textAnchor="middle"
            dominantBaseline="middle"
            className="data-mono text-xs fill-terminal-label"
          >
            N/A
          </text>
        </svg>
      </div>
    );
  }

  // Calculate stroke dash array for donut chart
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const scoreOffset = circumference - (score / 100) * circumference;

  // Color based on score
  const getColor = () => {
    if (score >= 70) return "var(--terminal-amber)";
    if (score >= 40) return "var(--terminal-amber)";
    return "var(--terminal-cyan)";
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--terminal-gray)"
          strokeWidth="20"
        />
        {/* Score arc with purple gradient */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--terminal-purple)" />
            <stop offset="100%" stopColor="var(--terminal-purple-light)" />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="20"
          strokeDasharray={circumference}
          strokeDashoffset={scoreOffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          className="transition-all duration-500"
        />
        {/* Center text */}
        <text
          x="60"
          y="55"
          textAnchor="middle"
          dominantBaseline="middle"
          className="data-mono text-2xl font-bold"
          fill={getColor()}
        >
          {score.toFixed(0)}
        </text>
        <text
          x="60"
          y="70"
          textAnchor="middle"
          dominantBaseline="middle"
          className="data-mono text-xs fill-terminal-label"
        >
          INDEX
        </text>
      </svg>
    </div>
  );
}
