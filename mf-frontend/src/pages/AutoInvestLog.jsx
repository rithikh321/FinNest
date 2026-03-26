import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge }    from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import API from "../api";

export default function AutoInvestLog() {
  const [log,     setLog]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/portfolio/autoinvest")
      .then(r => setLog(r.data))
      .finally(() => setLoading(false));
  }, []);

  const total = log.reduce((s, l) => s + l.amount, 0);

  if (loading) return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
    </div>
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Auto-Invest Log 🔄</h1>
        <p className="text-slate-500 text-sm mt-1">
          Every time your wallet hit ₹100 and invested automatically
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500">Total Auto-Invested</p>
            <p className="text-2xl font-bold text-emerald-600">₹{total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500">Number of Investments</p>
            <p className="text-2xl font-bold text-slate-800">{log.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Log List */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Investment Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {log.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <p className="text-3xl">🪣</p>
              <p className="text-slate-500 text-sm">No auto-investments yet</p>
              <p className="text-slate-400 text-xs">
                Keep making UPI payments — wallet auto-invests at ₹100
              </p>
            </div>
          )}
          {log.map((l) => (
            <div key={l.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-lg">
                  🚀
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{l.fund_name}</p>
                  <p className="text-xs text-slate-400">{l.category}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(l.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short",
                      year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-emerald-600 text-white">₹{l.amount}</Badge>
                <p className="text-xs text-slate-400 mt-1">wallet → ₹0</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
