import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge }    from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import API from "../api";

export default function InvestmentHistory() {
  const [investments, setInvestments] = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    API.get("/portfolio/investments")
      .then(r => setInvestments(r.data))
      .finally(() => setLoading(false));
  }, []);

  const total = investments.reduce((s, i) => s + i.amount, 0);

  if (loading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
    </div>
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Investment History</h1>
        <p className="text-slate-500 text-sm mt-1">Every unit purchased via RoundUp</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500">Total Invested</p>
            <p className="text-2xl font-bold text-emerald-600">₹{total}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500">Total Entries</p>
            <p className="text-2xl font-bold text-slate-800">{investments.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Investments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {investments.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-6">No investments yet</p>
          )}
          {investments.map((inv) => (
            <div key={inv.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-sm">
                  📈
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{inv.fund_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs">{inv.category}</Badge>
                    <span className="text-xs text-slate-400">
                      {inv.units?.toFixed(6)} units
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(inv.invested_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short",
                      year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">₹{inv.amount}</p>
                <Badge variant="outline" className="text-xs mt-1">via RoundUp 🔄</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
