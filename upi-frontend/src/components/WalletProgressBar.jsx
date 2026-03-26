import { Progress } from "@/components/ui/progress";
import { Badge }    from "@/components/ui/badge";

export default function WalletProgressBar({ wallet_balance = 0, compact = false }) {
  const pct = Math.min((wallet_balance / 100) * 100, 100);

  if (compact) return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>🪣 RoundUp Wallet</span>
        <span className="font-semibold text-slate-700">
          ₹{wallet_balance} / ₹100
        </span>
      </div>
      <Progress value={pct} className="h-2" />
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 space-y-3 border border-blue-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">🪣 RoundUp Wallet</p>
          <p className="text-xs text-slate-500">Auto-invests when it hits ₹100</p>
        </div>
        <Badge variant={pct >= 80 ? "destructive" : "secondary"}>
          {pct >= 80 ? "Almost Full!" : `${pct.toFixed(0)}% filled`}
        </Badge>
      </div>
      <Progress value={pct} className="h-3" />
      <div className="flex justify-between text-xs text-slate-600">
        <span className="font-medium">₹{wallet_balance} collected</span>
        <span>₹{(100 - wallet_balance).toFixed(2)} more to invest</span>
      </div>
    </div>
  );
}
