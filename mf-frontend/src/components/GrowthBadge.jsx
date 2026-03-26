export default function GrowthBadge({ value, suffix = "%" }) {
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full
      ${isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {isPositive ? "▲" : "▼"} {Math.abs(value)}{suffix}
    </span>
  );
}
