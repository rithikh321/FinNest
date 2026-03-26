import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge }    from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import WalletProgressBar from "../components/WalletProgressBar";
import API from "../api";

export default function Wallet() {
  const [wallet,  setWallet]  = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/wallet/status"),
      API.get("/wallet/history"),
    ]).then(([w, h]) => {
      setWallet(w.data);
      setHistory(h.data);
    }).finally(() => setLoading(false));
  }, []);

  const totalInvested = history
    .filter(h => h.type === "invested")
    .reduce((s, h) => s + h.amount, 0);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
    </div>
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">RoundUp Wallet 🪣</h1>
        <p className="text-slate-500 text-sm mt-1">
          Collects your roundups and auto-invests at ₹100
        </p>
      </div>

      {/* Wallet Status */}
      {wallet && <WalletProgressBar wallet_balance={wallet.wallet_balance} />}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-500">Current</p>
            <p className="text-xl font-bold text-blue-600">₹{wallet?.wallet_balance}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-500">Total Invested</p>
            <p className="text-xl font-bold text-green-600">₹{totalInvested}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-500">Auto-Invests</p>
            <p className="text-xl font-bold text-purple-600">
              {history.filter(h => h.type === "invested").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Preferred Fund */}
      {wallet?.preferred_fund && (
        <Card className="border-0 shadow-sm bg-blue-50 border-blue-100">
          <CardContent className="pt-4">
            <p className="text-xs text-slate-500 mb-1">Auto-Investing Into</p>
            <p className="font-semibold text-blue-700">{wallet.preferred_fund.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{wallet.preferred_fund.category}</Badge>
              <span className="text-xs text-green-600 font-medium">
                {wallet.preferred_fund.return_1y}% / yr
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet History */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Wallet Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {history.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">No activity yet</p>
          )}
          {history.map((h) => {
            const isInvest = h.type === "invested";
            const date = new Date(h.timestamp).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
            });
            return (
              <div key={h.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm
                    ${isInvest ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"}`}>
                    {isInvest ? "🚀" : "🪣"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {isInvest ? `Invested into ${h.fund_name}` : "Roundup added"}
                    </p>
                    <p className="text-xs text-slate-400">{date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm
                    ${isInvest ? "text-green-600" : "text-blue-600"}`}>
                    {isInvest ? "−" : "+"}₹{h.amount}
                  </p>
                  <p className="text-xs text-slate-400">bal: ₹{h.wallet_balance_after}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}
