import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge }    from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import GrowthBadge from "../components/GrowthBadge";
import RiskBadge   from "../components/RiskBadge";
import API from "../api";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [history,   setHistory]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/portfolio"),
      API.get("/portfolio/investments"),
    ]).then(([p, h]) => {
      setPortfolio(p.data);
      // build cumulative chart data from investment history
      let cumulative = 0;
      const chartData = h.data.map((inv) => {
        cumulative += inv.amount;
        return {
          date: new Date(inv.invested_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          invested: +cumulative.toFixed(2),
          value:    +(cumulative * 1.04).toFixed(2), // simulated growth
        };
      }).reverse();
      setHistory(chartData);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
    </div>
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Portfolio</h1>
        <p className="text-slate-500 text-sm mt-1">All your RoundUp investments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500">Total Invested</p>
            <p className="text-xl font-bold text-slate-800">
              ₹{portfolio?.total_invested?.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500">Current Value</p>
            <p className="text-xl font-bold text-emerald-600">
              ₹{portfolio?.total_current_value?.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-slate-500">Total P&L</p>
            <p className={`text-xl font-bold
              ${portfolio?.total_profit_loss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {portfolio?.total_profit_loss >= 0 ? "+" : ""}
              ₹{portfolio?.total_profit_loss?.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      {history.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Portfolio Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val) => `₹${val}`}
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend />
                <Line
                  type="monotone" dataKey="invested"
                  stroke="#94a3b8" strokeWidth={2}
                  dot={false} name="Invested"
                />
                <Line
                  type="monotone" dataKey="value"
                  stroke="#10b981" strokeWidth={2}
                  dot={false} name="Current Value"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Holdings Detail */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Fund-wise Holdings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {portfolio?.holdings?.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-6">
              No holdings yet. Make a UPI payment to start investing!
            </p>
          )}
          {portfolio?.holdings?.map((h) => (
            <div key={h.fund_id}
              className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{h.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">{h.category}</Badge>
                    <RiskBadge level={h.risk_level} />
                  </div>
                </div>
                <GrowthBadge value={h.profit_pct} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm pt-1 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Invested</p>
                  <p className="font-medium">₹{h.total_amount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Current</p>
                  <p className="font-medium text-emerald-600">₹{h.current_value?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Units</p>
                  <p className="font-medium">{h.total_units?.toFixed(4)}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
