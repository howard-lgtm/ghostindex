"use client";

interface SparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({
  data = [],
  width = 60,
  height = 20,
  color = "var(--terminal-cyan)",
}: SparklineProps) {
  // Generate random data if none provided
  const points = data.length > 0 ? data : Array.from({ length: 12 }, () => Math.random() * 100);

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  // Create SVG path
  const pathData = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d={pathData}
        fill="none"
        stroke="url(#sparklineGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
