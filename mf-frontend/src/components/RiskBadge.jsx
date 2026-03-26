export default function RiskBadge({ level }) {
  const colors = {
    Low:    "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High:   "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[level] || colors.Medium}`}>
      {level} Risk
    </span>
  );
}
